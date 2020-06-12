import * as THREE from "three";


export class Camera extends THREE.PerspectiveCamera{
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {

    super(45, window.innerWidth / window.innerHeight, 1,  1000);

    this.frame =0;//1050;
    this.eansingBool = true;

    this.camPos = new THREE.Vector3(100, 300,120);
    // this.camTarget = new THREE.Vector3(-370, 0,320);
    this.camTarget = new THREE.Vector3(-470, 0,400);

    this.lookPos = new THREE.Vector3(45, 50, 45);
    this.lookTarget = new THREE.Vector3(45, 50, 45);

    this.getCamPos = this.getCamPos.bind(this);
    // window.addEventListener('click', this.getCamPos);

  }

  /**
   * 毎フレームの更新をかけます。
   */
  update() {

    if(this.frame < 1800){
        this.frame += 2;//２倍速
    }else{ 
        this.frame = 1800;//1800以上は読まないよー
        this.eansingBool == false;//頂点入れ替えもしない。
    }

    if (this.eansingBool == true){
        //イージング
        // this.camPos += (this.camTarget - this.camPos)*0.02;//この書き方動かない！！！！！！！
        this.camPos.x += (this.camTarget.x - this.camPos.x) *0.006*2;//*2は２倍速
        this.camPos.y += (this.camTarget.y - this.camPos.y) *0.006*2;//*2は２倍速
        this.camPos.z += (this.camTarget.z - this.camPos.z) *0.006*2;//*2は２倍速
        this.position.set(this.camPos.x,this.camPos.y,this.camPos.z);

        //lookPosイージング
        this.lookPos.x += (this.lookTarget.x - this.lookPos.x) *0.01*2;
        this.lookPos.y += (this.lookTarget.y - this.lookPos.y) *0.01*2;
        this.lookPos.z += (this.lookTarget.z - this.lookPos.z) *0.01*2;
        this.lookAt(this.lookPos);//これ大事！！！！
    }


    if(this.frame >= 0 && this.frame <1170){

      //camTargetの初期化とcamPosの取得
      if(this.frame == 20){
        // this.lookTarget = new THREE.Vector3(45, 100, 45);
        // this.camTarget = new THREE.Vector3(-320, -200,-200);
        // this.camTarget = new THREE.Vector3(-470, -200,-600);
      }
      if(this.frame == 50){
        this.lookTarget = new THREE.Vector3(45, 80, 45);
        // this.camTarget = new THREE.Vector3(-20, -130,-150);
      }
      if(this.frame == 100){
        // this.lookTarget = new THREE.Vector3(45, 80, 45);
        // this.camTarget = new THREE.Vector3(-190, -30,-170);
        this.camTarget = new THREE.Vector3(100, -230,290);
      }
      if(this.frame == 280){
        this.lookTarget = new THREE.Vector3(45, 50, 45);
        // this.camTarget = new THREE.Vector3(-150, 190,-260);
      }
      if(this.frame == 460){
          this.frame += (780 - 460);
      }
      if(this.frame == 420){
        this.camTarget = new THREE.Vector3(270,60,-60);
        // this.lookTarget = new THREE.Vector3(140, 70, 140);
      }//斜めのときの中心}//800
      // if(this.frame == 700){this.camTarget = new THREE.Vector3(230, 60,-60);}
      
      if(this.frame == 900){this.camTarget = new THREE.Vector3(100, -100,330);}

    }

    if(this.frame == 1150){
      this.frame += (1200-1150);
    }


    if(this.frame >= 1200){

      //lookTargetの初期化とcamPosの取得
      if(this.frame== 1200){
        this.lookTarget = new THREE.Vector3(140, 70, 140);//斜めのときの中心
        // this.lookTarget = new THREE.Vector3(70, 35, 70);
        this.camTarget = new THREE.Vector3(240,480,0);
      }

      if(this.frame== 1300){
        // this.lookTarget = new THREE.Vector3(140, 70, 140);//斜めのときの中心
        // this.camTarget = new THREE.Vector3(-140,180,40);
        
      }

      // if(this.frame == 1370){this.camTarget = new THREE.Vector3(-50,75,400);}
      // if(this.frame == 1270){this.camTarget = new THREE.Vector3(-250,150,-250);}//-100,300,400
      
      if(this.frame == 1370){
        this.lookTarget = new THREE.Vector3(70, 40, 70);
        this.camTarget = new THREE.Vector3(10,3,-20);
      }
    }
  }

  getCamPos(){
    // console.log(this.frame);
    // console.log(this.getWorldPosition());
  }

}

