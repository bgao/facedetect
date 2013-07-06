function dataURItoBlob(dataURI) {
  'use strict'
  var byteString,  mimestring;
  
  if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
    byteString = atob(dataURI.split(',')[1])
  } else {
    byteString = decodeURI(dataURI.split(',')[1])
  }

  mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
  var content = new Array();
  for (var i = 0; i < byteString.length; i++) {
    content[i] = byteString.charCodeAt(i)
  }
  
  return new Blob([new Uint8Array(content)], {type: mimestring});
}

function streamVideo() {
  var socket = io.connect('http://localhost:3000')
    , canvas = document.querySelector('#canvas')
    , video = document.querySelector('#video')
    , image = document.querySelector('#image')
    , width = 640
    , height = 0
    , streaming = false;

  navigator.getMedia = (navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia);

  navigator.getMedia(
    { video: true, audio: false },
    function(stream) {
      if (navigator.mozGetUserMedia) {
	video.mozSrcObject = stream;
      } else {
	var vendorURL = window.URL || window.webkitURL;
	video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
      }
      video.play();
    },
    function(err) {
      console.log("An error occurred! " + err);
    }
  );

  var faces = new Array();

  // draw the video and faces to the canvas
  var timer = setInterval(function() {
    canvas.getContext('2d').drawImage(video, 0, 0, width, height);
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 4;
    for(var i = 0; i < faces.length; i++) {
      ctx.beginPath();
      ctx.strokeRect(faces[i].x,faces[i].y,faces[i].width,faces[i].height);
      ctx.stroke();
    }
  }, 50);

  // Send the image to the server
  timer = setInterval(function() {
    var data = canvas.toDataURL('image/png');
    // newblob = dataURItoBlob(data);
    socket.emit('clientImage', {image: data});
  }, 500);

  video.addEventListener('canplay', function(ev) {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      streaming = true;
      canvas.width = width;
      canvas.height = height;
    }
  }, false);

  socket.on('message', function(data) {
    if (data.message) {
      message.innerHTML = data.message;
    } else {
      console.log("Socket on message error: " + data);
    }
  });

  socket.on('face', function(data) {
    var _faces = data.faces;
    faces.length = 0;
    for (var i = 0; i < _faces.length; i++) {
      faces[i] = _faces[i];
    }
  });
}