navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.mozGetUserMedia);

var video = document.getElementById('preview');
var mediaStream = null;

function start() {
  var captureMedia = {
    video: true,
    audio: false
  };

  navigator.getUserMedia(captureMedia,
    function (localMediaStream) {
      mediaStream = localMediaStream;
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    },
    function (error) {
      console.log('error: ' + error);
    });
  toggle = pause;
}

function pause() {
  window.URL.revokeObjectURL(video.src);
  video.pause();
  mediaStream.stop();
  toggle = start;
}

var toggle = pause;

function toggleFunc() {
  toggle();
}

video.addEventListener('click', toggleFunc);

start();
