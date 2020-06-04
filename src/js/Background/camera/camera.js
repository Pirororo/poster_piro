import * as THREE from "three";


export class Camera extends THREE.PerspectiveCamera{
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {

    super(45, window.innerWidth / window.innerHeight, 1,  1000);

    this.frame =0;//1050;




    // this.camPos = new THREE.Vector3(100, 200, 120);
    // this.camTarget = new THREE.Vector3(-270, 300,320);
    this.camPos = new THREE.Vector3(100, 300,120);
    this.camTarget = new THREE.Vector3(-370, 300,320);

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
    this.camPos.x += (this.camTarget.x - this.camPos.x) *0.012;
    this.camPos.y += (this.camTarget.y - this.camPos.y) *0.012;
    this.camPos.z += (this.camTarget.z - this.camPos.z) *0.012;
    this.position.set(this.camPos.x,this.camPos.y,this.camPos.z);

    //lookPosイージング
    this.lookPos.x += (this.lookTarget.x - this.lookPos.x) *0.02;
    this.lookPos.y += (this.lookTarget.y - this.lookPos.y) *0.02;
    this.lookPos.z += (this.lookTarget.z - this.lookPos.z) *0.02;
    this.lookAt(this.lookPos);//これ大事！！！！


    if(this.frame >= 0 && this.frame <1170){
      // //原点に注目
      // this.lookAt(new THREE.Vector3(45, 50, 45));//これ大事！！！！
      
      //camTargetの初期化とcamPosの取得
      if(this.frame == 30){
        // this.lookTarget = new THREE.Vector3(45, 100, 45);
        this.camTarget = new THREE.Vector3(-320, 50,-200);
      }
      if(this.frame == 60){
        // this.lookTarget = new THREE.Vector3(45, 100, 45);
        this.camTarget = new THREE.Vector3(-120, -130,-20);
      }
      if(this.frame == 130){
        this.lookTarget = new THREE.Vector3(45, 80, 45);
        // this.camTarget = new THREE.Vector3(-190, -30,-170);
      }
      if(this.frame == 280){
        this.lookTarget = new THREE.Vector3(45, 50, 45);
        this.camTarget = new THREE.Vector3(-120, 350,320);
      }
      if(this.frame == 460){
          this.frame += (780 - 460);
      }
      if(this.frame == 420){this.camTarget = new THREE.Vector3(170,150,50);}//800
      if(this.frame == 700){this.camTarget = new THREE.Vector3(230, 60,-60);}
      if(this.frame == 900){this.camTarget = new THREE.Vector3(100, -100,-130);}

    }

    if(this.frame == 1150){
      this.frame += (1200-1150);
    }

    // if(this.frame >= 1370){
    if(this.frame >= 1200){

        // //lookPosイージング
        // this.lookPos.x += (this.lookTarget.x - this.lookPos.x) *0.02;
        // this.lookPos.y += (this.lookTarget.y - this.lookPos.y) *0.02;
        // this.lookPos.z += (this.lookTarget.z - this.lookPos.z) *0.02;
        // this.lookAt(this.lookPos);//これ大事！！！！


      //lookTargetの初期化とcamPosの取得
      if(this.frame== 1200){
        this.lookTarget = new THREE.Vector3(140, 70, 140);//斜めのときの中心
        // this.lookTarget = new THREE.Vector3(70, 35, 70);
        this.camTarget = new THREE.Vector3(240,480,160);
      }

      if(this.frame== 1300){
        // this.lookTarget = new THREE.Vector3(140, 70, 140);//斜めのときの中心
        // this.camTarget = new THREE.Vector3(-140,180,40);
        
      }

      //camTargetの初期化とcamPosの取得
      // if(this.frame == 1370){this.camTarget = new THREE.Vector3(-50,75,400);}
      // if(this.frame == 1270){this.camTarget = new THREE.Vector3(-250,150,-250);}//-100,300,400
      
      if(this.frame == 1370){
        this.lookTarget = new THREE.Vector3(70, 40, 70);
        this.camTarget = new THREE.Vector3(10,3,-20);
        
      }//175,75,175
    }
  }

  getCamPos(){
    // console.log(this.frame);
    // console.log(this.getWorldPosition());
  }

}

