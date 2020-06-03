import * as THREE from "three";


export class Camera extends THREE.PerspectiveCamera{
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {

    super(45, window.innerWidth / window.innerHeight, 1,  1000);

    this.frame =1000;




    this.camPos = new THREE.Vector3(100, 100, 120);
    this.camTarget = new THREE.Vector3(-270, 300,320);

    this.lookPos = new THREE.Vector3(45, 50, 45);
    this.lookTarget = new THREE.Vector3(45, 50, 45);

    this.getCamPos = this.getCamPos.bind(this);
    // window.addEventListener('click', this.getCamPos);

  }

  /**
   * 毎フレームの更新をかけます。
   */
  update() {

    this.frame += 1;

    //イージング
    // this.camPos += (this.camTarget - this.camPos)*0.02;//この書き方動かない！！！！！！！
    this.camPos.x += (this.camTarget.x - this.camPos.x) *0.01;
    this.camPos.y += (this.camTarget.y - this.camPos.y) *0.01;
    this.camPos.z += (this.camTarget.z - this.camPos.z) *0.01;
    this.position.set(this.camPos.x,this.camPos.y,this.camPos.z);


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
      if(this.frame== 1370){
        this.lookTarget = new THREE.Vector3(140, 70, 140);//斜めのときの中心
      }

      //camTargetの初期化とcamPosの取得
      if(this.frame == 1370){this.camTarget = new THREE.Vector3(-50,75,400);}
      if(this.frame == 1470){this.camTarget = new THREE.Vector3(100,70,100);}//175,75,175
    }
  }

  getCamPos(){
    // console.log(this.frame);
    // console.log(this.getWorldPosition());
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
