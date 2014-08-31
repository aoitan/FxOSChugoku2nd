(function (exports) {
  var canvas;
  var _raster;
  var _param;
  var _detector;
  var _markerRoot = markerRoot = new THREE.Object3D();
  var _videoTex;

  function drawImage(video) {
    canvas.getContext('2D').drawImage(video, 0, 0, video.width, video.height);
    canvas.changed = true;
  }

  function markerCount() {
    _detector.detectMarkerLite(_raster, threshold);
  }

  function getMatrixs() {
    var resultMat = new NyARTransMatResult();

    var markers = {};

    for (var idx = 0; idx < markerCount; idx++) {
      var id = detector.getIdMarkerData(idx);

      var currId = -1;
      if (id.packetLength <= 4) {
        currId = 0;
        for (var i = 0; i < id.packetLength; i++) {
          currId = (currId << 8) | id.getPacketData(i);
        }
      }

      if (markers[currId] == null) {
        markers[currId] = {};
      }
      detector.getTransformMatrix(idx, resultMat);

      markers[currId].transform = Object.asCopy(resultMat);
    }
    return markers;
  }

  function copyMarkerMatrix(arMat) {
    var glMat = [];
    glMat[0] = arMat.m00;
    glMat[1] = -arMat.m10;
    glMat[2] = arMat.m20;
    glMat[3] = 0;
    glMat[4] = arMat.m01;
    glMat[5] = -arMat.m11;
    glMat[6] = arMat.m21;
    glMat[7] = 0;
    glMat[8] = -arMat.m02;
    glMat[9] = arMat.m12;
    glMat[10] = -arMat.m22;
    glMat[11] = 0;
    glMat[12] = arMat.m03;
    glMat[13] = -arMat.m13;
    glMat[14] = arMat.m23;
    glMat[15] = 1;
    return glMat;
  }

  function setFromArray(dst, m) {
    return dst.set(
      m[0], m[4], m[8], m[12],
      m[1], m[5], m[9], m[13],
      m[2], m[6], m[10], m[14],
      m[3], m[7], m[11], m[15]
    );
  };

  function init (camera, scene, cube, video, videoCanvas) {
    canvas = document.createElement('canvas');
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    _raster = new NyARRgbRaster_Canvas2D(canvas);
    _param = new FLARParam(video.width, video.height);
    _detector = new FLARMultiIdMarkerDetector(_param, 120);
    _detector.setContinueMode(true);
    var projectionMatrix = _param.getPerspectiveProjectionMatrix();
    _param.copyCameraMatrix(camera.projectionMatrix, 10, 10000);

    _markerRoot.matrixAutoUpdate = false;

    var tmp = new Float32Array(16);

    _markerRoot.add(cube);

    scene.add(_markerRoot);

    _param.copyCameraMatrix(tmp, 10, 10000);
    setFromArray(camera.projectionMatrix, tmp);


    _videoTex = new THREE.Texture(videoCanvas);

    var plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2, 0),
      new THREE.MeshBasicMaterial({map: _videoTex})
    );

    plane.material.depthTest = false;
    plane.material.depthWrite = false;

    scene.add(plane);
    scene.add(camera);
  }

  function tick(renderer, camera, scene, video, videoCanvas) {
//    try {
//      videoCanvas.getContext('2d').drawImage(video, 0, 0);
//      canvas.getContext('2d').drawImage(videoCanvas, 0, 0, canvas.width, canvas.height);
//    } catch(e) {
//      if (e.name === 'NS_ERROR_NOT_AVAILABLE') {
//        setTimeout(tick.bind(this, renderer, camera, scene, video, videoCanvas), 100);
//      } else {
//        throw e;
//      }
//    }
//
//    canvas.changed = true;
//
//    _videoTex.needsUpdate = true;
//
//    var markerCount = _detector.detectMarkerLite(_raster, 100);
//    for (var i=0; i<markerCount; i++) {
//      _detector.getTransformMatrix(i, resultMat);
//
//      copyMarkerMatrix(resultMat, tmp);
//
//      _markerRoot.matrix.setFromArray(tmp);
//    }
//
//    renderer.autoClear = false;
//    renderer.clear();
    renderer.render(scene, camera);
  }

  var ARDemo = {
    drawImage: drawImage,
    markerCount: markerCount,
    getMatrixs: getMatrixs,
    tick:tick,
    init: init
  };

  exports.ARDemo = ARDemo;
})(this);
