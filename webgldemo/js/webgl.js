// constructor
function WebGLSample() {
}

WebGLSample.prototype = {
  _scene: null,
  _cameraParam: null,
  _camera: null,
  _renderer: null,
  _light: null,
  _mesh: null,

  initScene: function () {
    this._scene = new THREE.Scene();
  },

  initCamera: function () {
    var title = document.getElementById('app_title');
    var width = window.screen.width;
    var height = window.screen.height;
    this._cameraParam = {
      width: width,
      height: height - title.offsetHeight,
      fov: 60, // 画角
      aspect: width / height, // アスペクト比
      near: 1, // ニアクリップ
      far: 1000 // ファークリップ
    };
    console.log('width: ' + this._cameraParam.width +
                ', height: ' + this._cameraParam.height);
    this._camera = new THREE.PerspectiveCamera(this._cameraParam.fov,
                                               this._cameraParam.aspect,
                                               this._cameraParam.near,
                                               this._cameraParam.far);
  },

  appendRenderer: function () {
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize(this._cameraParam.width, this._cameraParam.height);
    var surface = document.getElementById('surface');
    surface.appendChild(this._renderer.domElement);
  },

  appendLight: function () {
    this._light = new THREE.DirectionalLight(0xffffff);
    this._light.position.set(0, 0.7, 0.7);
    this._scene.add(this._light);
  },

  createCubeMesh: function () {
    var geometory = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshPhongMaterial({color:0xd0d000});
    return new THREE.Mesh(geometory, material);
  },

  init: function () {
    // シーンを作る
    this.initScene();

    // カメラを作る
    this.initCamera();

    // カメラを中心から引いておく
    this._camera.position.set(0, 0, 50);

    // レンダラをDOMに追加しておく
    this.appendRenderer();

    // 光源を追加する
    this.appendLight();

    // メッシュを作ってシーンに追加
    this._mesh = this.createCubeMesh();
    this._scene.add(this._mesh);

    // 表示
    this.render();
  },

  rotate: function (x, y, z) {
    var ret = this._mesh.rotation.set(
        this._mesh.rotation.x + x,
        this._mesh.rotation.y + y,
        this._mesh.rotation.z + z);
  },

  position: function (x, y, z) {
    this._mesh.position.set(
        this._mesh.position.x + x,
        this._mesh.position.y + y,
        this._mesh.position.z + z);
  },

  render: function() {
    this._renderer.render(this._scene, this._camera);
  }
};

