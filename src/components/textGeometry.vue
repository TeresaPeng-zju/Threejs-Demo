<template>
  <div class="total">
    <div id="container" @click="onDocumentMouseDown"></div>
    <div class="function">
      <select>
        <option @click="stickCharacter()">文字</option>
        <option @click="setModel()">柱状模型</option>
        <option>载入模型</option>
        <option>摄像机</option>
        <option>灯光</option>
        <option>页面</option>
        <option>流动线</option>
      </select>
      <section v-show="isSelected">
        <h4>请输入文字</h4>
        <textarea id="txt"></textarea>
        <div id="btn" @click="createText()">确定</div>
      </section>
      <ul class="textUl" v-show="isSelected">
        <li
          v-for="(item, index) in textList"
          :key="index"
          @click="getIndex"
          :id="'textLi' + index"
        >
          {{ item }}
          <p class="close" @click="popTextList()">x</p>
        </li>
      </ul>
      <div class="setModel" v-show="isModel">
        <div class="chooseModel">
          <span>几何体类型选择：</span>
          <select>
            <option>立方体</option>
            <option>球体</option>
            <option>圆锥体</option>
            <option>圆柱体</option>
          </select>
        </div>
        <div class="length">
          <span>长：</span>
          <input type="text" />
        </div>
        <div class="width">
          <span>宽：</span>
          <input type="text" />
        </div>
        <div class="height">
          <span>高：</span>
          <input type="text" />
        </div>
        <div id="btn" @click="createGeo()">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { init } from "events";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  data() {
    return {
      scene: "",
      camera: "",
      renderer: "",
      event: "",
      txtMesh: "",
      textList: [],
      selectLi: "",
      mytxt: "",
      txtMesh: "",
      index: "",
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState({
      isSelected: (state) => state.showTextarea.isSelected,
      isShow: (state) => state.showCharacter.isShow,
      isModel: (state) => state.showModel.isModel,
    }),
  },
  methods: {
    ...mapMutations({
      chanIsSelected: "showTextarea/chanIsSelected",
      chanIsShow: "showCharacter/chanIsShow",
      chanIsModel: "showModel/chanIsModel",
    }),
    init() {
      this.createScene();
      this.createAxesHelper();
      // this.createTxtMesh();
      this.createLight();
      this.createCamera();
      this.creatNomalBox();
      this.creatPlane();
      this.createRender();
      this.createControls();
      this.render();
      // this.onDocumentMouseDown();
      let that = this;
      window.addEventListener(
        "resize",
        function onResize() {
          that.camera.aspect = window.innerWidth / window.innerHeight;
          that.camera.updateProjectionMatrix();
          that.renderer.setSize(window.innerWidth * 0.8, window.innerHeight);
        },
        false
      );
      // window.addEventListener("mousedown", this.onDocumentMouseDown); //页面绑定鼠标点击事件
    },
    //获取当前点击的index
    getIndex(event) {
      // console.log(event.target);
      // event.target.className = "active";
      for (let i = 0; i < this.textList.length; i++) {
        var indexLi = document.getElementById("textLi" + i);
        console.log(indexLi);
        indexLi.className = "";
      }
      event.target.className = "active";
      // event.target.isActive = 1;
    },
    //出现模态框
    stickCharacter() {
      this.chanIsSelected(true);
    },
    //创建柱状模型
    setModel() {
      this.chanIsModel(true);
    },
    //创建场景
    createScene() {
      this.scene = new THREE.Scene();
    },
    //创建常规正方体
    creatNomalBox() {
      var geometry1 = new THREE.BoxGeometry(1, 1, 1);
      var material1 = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
      }); //材质对象Material
      var mesh1 = new THREE.Mesh(geometry1, material1); //网格模型对象Mesh
      mesh1.position.set(0, 0, 0);
      this.scene.add(mesh1); //网格模型添加到场景中
      console.log(mesh1);
    },
    //创建地板几何体
    creatPlane() {
      var geometry = new THREE.PlaneGeometry(100, 100);
      var material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
      });
      var plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 0);
      this.scene.add(plane);
    },
    //添加坐标轴辅助器
    createAxesHelper() {
      const axesHelper = new THREE.AxesHelper(5);
      this.scene.add(axesHelper);
    },
    //点击"确定"按钮-创建模型
    createText() {
      // for (let i = -1; i < this.textList.length; i++) {
      var mytxt = txt.value;
      this.textList.push(mytxt);
      // }
      console.log(this.textList);
      const loader = new FontLoader();
      const url = "fonts/siyuanheiti_Regular.json";
      let that = this;
      loader.load(url, function (font) {
        var txtGeo = new TextGeometry(mytxt, {
          font: font,
          size: 0.8,
          height: 0.1,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.05,
          bevelSegments: 3,
        });
        var txtMater = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        var txtMesh = new THREE.Mesh(txtGeo, txtMater);
        //给txtMesh赋name
        that.txtMesh.name = that.txtMesh + this.textList.indexof(that.txtMesh);
        console.log(txtMesh.name);
        txtMesh.position.set(0, 0, 0);
        that.scene.add(txtMesh);
      });
    },
    //点击"x"删除列表元素
    popTextList() {
      //1 删除列表数据
      this.textList.pop(this.mytxt);
      //2 删除几何体
      console.log(this.txtMesh);
      this.scene.remove(this.txtMesh);
      //this.scene.children
    },
    // 创建光源
    createLight() {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // 创建环境光
      this.scene.add(ambientLight); // 将环境光添加到场景
      const spotLight = new THREE.SpotLight(0xffffff); // 创建聚光灯
      spotLight.position.set(-40, 60, -10);
      spotLight.castShadow = true;
      this.scene.add(spotLight);
    },
    // 创建相机
    createCamera() {
      const element = document.getElementById("container");
      const width = window.innerWidth; // 窗口宽度
      const height = window.innerHeight; // 窗口高度
      const k = width / height; // 窗口宽高比
      this.camera = new THREE.PerspectiveCamera(35, k, 0.1, 1000);
      this.camera.position.set(0, 0, 10); // 设置相机位置
      this.camera.lookAt(new THREE.Vector3(10, 0, 0)); // 设置相机方向
      this.scene.add(this.camera);
    },
    //创建渲染器
    createRender() {
      const element = document.getElementById("container");
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(window.innerWidth * 0.8, window.innerHeight); // 设置渲染区域尺寸
      this.renderer.shadowMap.enabled = true; // 显示阴影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setClearColor(0x3f3f3f, 1); // 设置背景颜色
      element.appendChild(this.renderer.domElement);
    },
    //渲染
    render() {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.render);
    },
    // 创建控件对象
    createControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    onDocumentMouseDown(event) {
      console.log(event);
      event.preventDefault();
      var vector = new THREE.Vector3(); //三维坐标对象
      vector.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      vector.unproject(this.camera);
      var raycaster = new THREE.Raycaster(
        this.camera.position,
        vector.sub(this.camera.position).normalize()
      );
      console.log(this.scene.children);
      var intersects = raycaster.intersectObjects(this.scene.children);
      // console.log(this.scene.children.length); //得到7
      // console.log(this.scene.children[7]);//undefined
      if (intersects.length > 0) {
        var selected = intersects[0]; //取第一个物体
        console.log(selected);
        console.log("x坐标:" + selected.point.x);
        console.log("y坐标:" + selected.point.y);
        console.log("z坐标:" + selected.point.z);
        this.scene.children[this.scene.children.length - 1].position.set(
          selected.point.x,
          selected.point.y,
          selected.point.z
        );
      }
    },
  },
};
</script>
 
<style lang = "less" scoped>
.total {
  display: flex;
  .function {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    flex-flow: wrap;
    background-color: #efefef;
    select {
      margin-right: 10px;
      background: #fff;
    }
    section {
      display: flex;
      flex-flow: wrap;
      overflow: hidden;
      width: 80%;
      padding: 10px;
      background: #fff;
      margin: 100px auto 20px;
      h4 {
        margin-bottom: 10px;
      }
      textarea {
        height: 150px;
        width: 200px;
      }
      #btn {
        margin-top: 10px;
        height: 20px;
        line-height: 20px;
        width: 32px;
        background-color: gray;
        color: #ffffff;
        cursor: pointer;
      }
    }
    .textUl {
      width: 80%;
      li {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}

.active {
  background-color: #cfc;
}
.nonactive {
  background-color: #fff;
}

.setModel {
  .chooseModel {
    padding-bottom: 10px;
  }
  .length {
    padding-bottom: 10px;
  }
  .width {
    padding-bottom: 10px;
  }
  #btn {
    margin-top: 10px;
    height: 20px;
    line-height: 20px;
    width: 32px;
    background-color: gray;
    color: #ffffff;
    cursor: pointer;
  }
}
</style>