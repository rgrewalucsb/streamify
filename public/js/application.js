$(document).ready(function() {

var autoplayArtists = false;
  function pickRandomVideo(availableVideos, artist){
    pickArtist = artist;
    if (availableVideos.length != null){
      var randIndex = Math.floor((Math.random()*availableVideos.length));
      var pickedVideo = availableVideos[randIndex];
      availableVideos.splice(randIndex,1); 
      playVideo(pickedVideo.url, availableVideos);
    }else {
      pickRandomArtist(event, artist)
    }
    
  }

  function playVideo(url, videos){
    var pickedVideoUrl = url.split('watch?v=');
    var pickedDmURL = pickedVideoUrl[0].split('.com/video/');
    var videoCode
    if (pickedVideoUrl[0] == "http://www.youtube.com/"){
      var code = pickedVideoUrl[1].split('&');
      videoCode = code[0];
      onYouTubeIframeAPIReady(url);
      
    }
    else if (pickedDmURL[0] == "http://www.dailymotion"){
      var code = pickedDmURL[1].split('_');
      videoCode = code[0];
      onDailyMotionAPIReady(url);
      url
    }
    else {
      pickRandomVideo(videos);
    }
  }
//Play Random Artist
  function pickRandomArtist(event, artistArray){
    if (artistArray != undefined && artistArray.length > 1){
      var randIndex = Math.floor((Math.random()*artistArray.length));
      var pickedArtist = artistArray[randIndex].name;
      artistArray.splice(randIndex,1); 
      ArtistVideos(event, pickedArtist);
    }
    else if (artistArray.length == 1){
      ArtistVideos(artistArray[0], pickedArtist);
    }
  };


  var pickArtist
//Pick Artist
  $('#search').on('submit', '#artistform', function(event){
    $('#likeArtist').removeClass("btn-success").addClass("btn-default");
    autoplayArtists = false;
    pickArtist = $(this).serialize().split('=')[1]
    $(this)[0].reset();
    ArtistVideos(event,pickArtist);
  })

  $('#artistlist').on('submit', function(event){
    $('#likeArtist').removeClass("btn-success").addClass("btn-default");
    autoplayArtists = false;
    event.preventDefault();
    pickArtist = $(this).serialize().split('=')[1]
    $('#artistselect').empty();
    ArtistVideos(event, pickArtist);
    
  })


  $('#artistlikes').on('submit', function(event){
    $('#likeArtist').removeClass("btn-success").addClass("btn-default");
    autoplayArtists = false;
    event.preventDefault();
    pickArtist = $(this).serializeArray()[0].value
    ArtistVideos(event, pickArtist);
  })

  var likedArtists = [];

  var resetLikes = function(){$.getJSON('/likes', function(data){
      data.forEach(function(entry){
        likedArtists.push(entry.artist)
        $('#artistselecter').append("<option value='" + entry.artist + "'>" + entry.artist + "</option>");
      })
    })
  }
  resetLikes();
  $('#leftbutton').on('click', '#randomplay', function(event){
    $('#likeArtist').removeClass("btn-success").addClass("btn-default");
    autoplayArtists = true;
    $.ajax({
      type: "GET",
      url: '/likes'
    })
    .done(function(data){
      var randIndex = Math.floor((Math.random()*data.length));
      var pickedArtist = data[randIndex].artist;
      pickArtist = pickedArtist;
      ArtistVideos(event, pickedArtist);
    })
    .fail(function(){
      console.log("ERROR")
    })
  })

  var ArtistVideos = function(event,artist){
    event.preventDefault();
    $.ajax({
      url: "/artist",
      type: "POST",
      dataType: 'json',
      data: {artist: artist}
    }).done(function(data){
       pickRandomVideo(data.response.video, artist);
    });
  }

  $('button#register').on('click', function(event){
    event.preventDefault();
    $('.login').css('display', 'none');
    $('.register').css('display', 'block');
  })


  $('button#login').on('click', function(event){
    event.preventDefault();
    $('.register').css('display', 'none');
    $('.login').css('display', 'block');
  })
  

  $('#registerform').on('submit', function(event){
    event.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/register',
      data: $(this).serialize()
    })
    .done(function(data){
      $('.register').css('display', 'none');
      $('.login').css('display', 'block');
    })
    .fail(function(data){
      alert("That username is already in use!")
      $('#registerform')[0].reset();
    })
  })
  $('#loginform').on('submit', function(event){
    event.preventDefault();
    $(this).find("button[type='submit']").prop('disabled',true);
    $.ajax({
      type: 'GET',
      url: '/login',
      data: $(this).serialize()
    })
    .done(function(data){
      $('.register').css('display', 'none');
      $('.login').css('display', 'none');
      $('.container').first().append("<div id='navbar' class='navbar-form navbar-right'><a class='btn btn-warning' href='/logout'>Logout</a></div>")
      $('#navbarleft').append("<form id='artistlikes' method='post'><select id='artistselecter' name='artist' class='btn btn-default'> <option value='' disabled selected>Liked Artists</option></select><input type='submit' name='submit' value='GO' class='btn btn-success'/></form>");
      $('#leftbutton').append("<button id='randomplay' class='btn btn-default'><img class='icon' src='/imgs/shuffle.png'></button>");
      $('#rightbutton').append("<button type='button' id='likeArtist' class='btn btn-default'><img class='icon' src='/imgs/like.png'></button>")
      $('#search').css('display', 'block');
      resetLikes();

    })
    .fail(function(data){
      alert("Invalid Login Credentials!");
      $('#loginform').find("button[type='submit']").prop('disabled',false);
      $('#loginform')[0].reset();
    })
  })

// //Pick Random Similar Artist
//   $('#options').on('click', '#similarArtist', function(event){
//     $('#likeArtist').removeClass("btn-success").addClass("btn-default");
//     autoplayArtists = false;
//     SimilarArtists(event, pickArtist);
//     $('#artistselect').empty();
//   })

//   var SimilarArtists = function(event, artist){
//     event.preventDefault();
//     $.ajax({
//       url: "/artist_similar",
//       type: "POST",
//       dataType: 'json',
//       data: {artist: artist}
//     }).done(function(data){
//       var $artists = data.response.artists;
//       pickRandomArtist(event, $artists);
//     })
//   }


//List All Similar Artists
  $('#options').on('click', '#listSimilarArtist', function(event){
    autoplayArtists = false;
    ListSimilarArtists(event, pickArtist);
    
  })

  var ListSimilarArtists = function(event, artist){
    $.ajax({
      url: "/artist_similar",
      type: "POST",
      dataType: 'json',
      data: {artist: artist}
    }).done(function(data){
      $('#artistselect').empty();
      var $artists = data.response.artists
      $.each($artists, function(index, artist){
        $('#artistselect').append("<option value='" + $artists[index].name + "'>" + $artists[index].name + "</option>");
        $('#artistlist').css('display', 'inline-block');
      })
    })
  }

  $('#rightbutton').on('click', '#likeArtist', function(event){
    autoplayArtists = false;
    $('#likeArtist').removeClass("btn-default").addClass("btn-success");
    event.preventDefault();
    $('#artistselecter').empty();
    resetLikes();
    $.ajax({
      type: 'PUT',
      url: '/artist_like',
      data: {artist: pickArtist}
    })
    
  })


  function onYouTubeIframeAPIReady(url) {
    $.ajax({
      type: 'POST',
      url: '/oembed/yt',
      dataType: 'json',
      data: {url: url}
    })
    .done(function(data){
      var like = likedArtists.indexOf(pickArtist);
      if (like != -1){
        $('#likeArtist').removeClass("btn-default").addClass("btn-success");
      };
      $('#artistselecter').empty();
      resetLikes();
      $('#player').empty();
      $('#options').css('display', 'block');
      $('#player').append(data.html);
      $('iframe').attr('width', 480);
      $('iframe').attr('height', 270);
      var autoplay = $('iframe').attr('src');
      autoplay = autoplay + '?rel=0&autoplay=1';
      $('iframe').attr('src', autoplay);
      if (autoplayArtists == true) {
        setTimeout(Randomize, 240000)
      };
    })
  }

  function onDailyMotionAPIReady(url) {
    $.ajax({
      type: 'POST',
      url: '/oembed/dm',
      dataType: 'json',
      data: {url: url}
    })
    .done(function(data){
      var like = likedArtists.indexOf(pickArtist);
      if (like != -1){
        $('#likeArtist').removeClass("btn-default").addClass("btn-success");
      };
      $('#player').empty();
      $('#artistselecter').empty();
      resetLikes();
      $('#options').css('display', 'block');
      $('#player').append(data.html);
      $('iframe').attr('width', 480);
      $('iframe').attr('height', 270);
      var autoplay = $('iframe').attr('src');
      autoplay = autoplay + '?rel=0&autoplay=1';
      $('iframe').attr('src', autoplay);
      if (autoplayArtists == true) {
        setTimeout(Randomize, 240000)
      };
    })

  }

  var Randomize = function(){
    // event.preventDefault();
    $.ajax({
      type: "GET",
      url: '/likes'
    })
    .done(function(data){
      var randIndex = Math.floor((Math.random()*data.length));
      var pickedArtist = data[randIndex].artist;
      ArtistVideos(event, pickedArtist);
      pickArtist = pickedArtist;
    })
    .fail(function(){
      console.log("ERROR")
    })
  }
  

});

  $(function() {
    $("#artist" ).autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: "/suggest",
                type: 'POST',
                data: {name: request.term},
                success: function( data ) {
                    response( $.map( data.response.artists, function(item) {
                        return {
                            label: item.name
                        }
                    }));
                }
            });
        },
        minLength: 3,
        select: function( event, ui ) {
            $("#log").empty();
            $("#log").append( ui.item.label);
        },
    });
});



  



