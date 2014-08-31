// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

  // We'll ask the browser to use strict code to help us catch errors earlier.
  // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  'use strict';

  var translate = navigator.mozL10n.get;

  // We want to wait until the localisations library has loaded all the strings.
  // So we'll tell it to let us know once it's ready.
  navigator.mozL10n.once(start);

  // ---

  document.addEventListener('visibilitychange', () => {
    var cameraDemo = window.CameraDemo;
    if (document.hidden) {
      cameraDemo.pause();
    } else {
      cameraDemo.play();
    }
  });

  function start() {
    var video = document.getElementById('preview');

    // カメラの用意
    var cameraDemo = window.CameraDemo;
    cameraDemo.start().then((mediaStream) => {
      var playPromise = new Promise((resolve) => {
        video.addEventListener('play', () => {
          resolve();
        });
        cameraDemo.play();
      });
      return playPromise;
    }).then(() => {
      // WebGLの用意
      var webglDemo = new WebGLSample();
      webglDemo.init();

      // ARの用意
      var arDemo = window.ARDemo;
      var videoPlane = document.getElementById('video-plane');
      arDemo.init(webglDemo.getCamera(), webglDemo.getScene(),
                  webglDemo.createCubeMesh(), video, videoPlane);

      // ループ
      function render() {
        arDemo.tick(webglDemo.getRender(), webglDemo.getCamera(),
                    webglDemo.getScene(), video, videoPlane);
        window.requestAnimationFrame(render);
      }
      window.requestAnimationFrame(render);
    });
  }
});
