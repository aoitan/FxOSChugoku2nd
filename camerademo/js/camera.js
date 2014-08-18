(function (exports) {
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.mozGetUserMedia);

  var _video = null;
  var _mediaStream = null;
  var _toggle = null;

  _video = document.getElementById('preview');
  _video.addEventListener('click', cd_toggleFunc);

  function cd_start() {
    var width = window.screen.width * window.devicePixelRatio;
    var title = document.getElementById('app_title');
    var height = window.screen.height * window.devicePixelRatio -
                 title.offsetHeight;
    var captureMedia = {
      video: true,
      audio: false
    };

    navigator.getUserMedia(captureMedia,
      (localMediaStream) => {
        _mediaStream = localMediaStream;
        _video.src = window.URL.createObjectURL(localMediaStream);
//        _video.width = width;
        _video.height = height;
      },
      (error) => {
        console.log('error: ' + error);
      });
  }

  function cd_play() {
    _video.play();

    _toggle = cd_pause;
  }

  function cd_pause() {
    _video.pause();
    _toggle = cd_play;
  };

  function cd_stop() {
    _mediaStream.stop();
    window.URL.revokeObjectURL(_video.src);
    _video.src = null;
  }

  function cd_toggleFunc() {
    _toggle();
  }

  var CameraDemo = {
    start: cd_start,
    play: cd_play,
    pause: cd_pause,
    stop: cd_stop
  };

  exports.CameraDemo = CameraDemo;
})(this);

