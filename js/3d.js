import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class modelViewer{
    constructor(){
        // 必要な要素
        this.container = document.querySelector('model-viewer');
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        // 3D空間に配置するもの
        this.ambientLight = null;
        this.mainLight = null;
        this.subLight01 = null;

        // オブジェクトのロード
        this.loader = null;

        // 初期化設定の呼び出し
        this.init()
    }
    async init(){

    }
}

const ModelViewer = new modelViewer;