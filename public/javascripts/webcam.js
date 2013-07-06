function webcam() {
  var streaming = false
    , video = document.querySelector('#video')
    //, canvas = document.querySelector('#canvas')
    , width = 640
    , height = 0;

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

  video.addEventListener('canplay', function(ev) {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      streaming = true;
    }
  }, false);
}