// import * as THREE from '../../libs/three.module.js';
import * as THREE from "three";


export class Camera extends THREE.PerspectiveCamera{
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {

    super(45, window.innerWidth / window.innerHeight, 1,  1000);

    this.frame =0;

    this.camPos = new THREE.Vector3(100, 100, 120);
    this.camTarget = new THREE.Vector3(-270, 300,320);

    this.lookPos = new THREE.Vector3(45, 50, 45);
    this.lookTarget = new THREE.Vector3(45, 50, 45);

    // // //単純な動きならこっちの書き方のほうがみやすいかも
    // // //ここから
    // let camPos = {x: 215, y: 180, z: 150};
    // this.position.set(camPos.x,camPos.y,camPos.z);

    // // var rndPos = (2*Math.random()-1)*100;//-100~100
    // // this.camTarget= {x:rndPos, y:rndPos, z:rndPos};
    // let camTarget= {x:50, y:20, z:-100};


    // this.tween = new TWEEN.Tween(camPos).to(camTarget, 1000).easing(TWEEN.Easing.Elastic.InOut).onUpdate(function(){
    // console.log('update');
    // this.position.x = camPos.x;
    // this.position.y = camPos.y;
    // this.position.z = camPos.z;
    // }).delay(1500).start();//tween.start();も省略されてる
    // //ここまで


    this.getCamPos = this.getCamPos.bind(this);
    window.addEventListener('click', this.getCamPos);


  }

  /**
   * 毎フレームの更新をかけます。
   */
  update() {

    // // TWEEN.update();

    this.frame += 1;

    //イージング
    // this.camPos += (this.camTarget - this.camPos)*0.02;//この書き方動かない！！！！！！！
    this.camPos.x += (this.camTarget.x - this.camPos.x) *0.01;
    this.camPos.y += (this.camTarget.y - this.camPos.y) *0.01;
    this.camPos.z += (this.camTarget.z - this.camPos.z) *0.01;
    this.position.set(this.camPos.x,this.camPos.y,this.camPos.z);

    
    // if(this.frame < 1370){
    //   //原点に注目
    //   this.lookAt(new THREE.Vector3(50, 50, 50));//これ大事！！！！

    //   //camTargetの初期化とcamPosの取得
    //   if(this.frame% 450 == 0){
    //     this.camTarget = new THREE.Vector3(
    //       // (2*Math.random()-1)*230+50,
    //       // (2*Math.random()-1)*230+25,
    //       // (2*Math.random()-1)*230+50
    //       (2*(Math.random())-1)*300+50,
    //       (2*(Math.random())-1)*300+25,
    //       (2*(Math.random())-1)*300+50,
    //     );
    //     // this.camPos = new THREE.Vector3(this.position.x, this.position.y, this.position.z);//要らない
    //   }
    // }

    if(this.frame >= 0 && this.frame <1320){
      //原点に注目
      this.lookAt(new THREE.Vector3(45, 50, 45));//これ大事！！！！
      
      //camTargetの初期化とcamPosの取得
      if(this.frame == 350){this.camTarget = new THREE.Vector3(420, 80,-100);}
      if(this.frame == 800){this.camTarget = new THREE.Vector3(-140,180,160);}
      if(this.frame == 1100){this.camTarget = new THREE.Vector3(-300,30,-220);}
    }


    // else if(this.frame >= 1370){
    else if(this.frame >= 1320){

      //lookPosイージング
      this.lookPos.x += (this.lookTarget.x - this.lookPos.x) *0.02;
      this.lookPos.y += (this.lookTarget.y - this.lookPos.y) *0.02;
      this.lookPos.z += (this.lookTarget.z - this.lookPos.z) *0.02;

      //lookPosに注目
      this.lookAt(this.lookPos);//これ大事！！！！

      //lookTargetの初期化とcamPosの取得
      if(this.frame== 1420){
        this.lookTarget = new THREE.Vector3(140, 70, 140);
      }

      //camTargetの初期化とcamPosの取得
      if(this.frame == 1420){this.camTarget = new THREE.Vector3(-170,30,600);}
      if(this.frame == 1620){this.camTarget = new THREE.Vector3(-300,70,300);}
    }
  }

  getCamPos(){
    console.log(this.frame);
    console.log(this.getWorldPosition());
  }

}

export class RoomCamera extends THREE.PerspectiveCamera{
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super(45, window.innerWidth / window.innerHeight, 10, 500);
  }

  /**
   * 毎フレームの更新をかけます。
   */
  update() {}
}

export class MoveCamera extends THREE.PerspectiveCamera{
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super(45, window.innerWidth / window.innerHeight, 10, 500);

  }

  /**
   * 毎フレームの更新をかけます。
   */
  update() {}
}
