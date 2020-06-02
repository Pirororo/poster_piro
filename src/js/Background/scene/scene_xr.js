
import * as THREE from "three";
import Line from '../objects/line.js';
import { EVENT, KEYCODE } from "../utils/props.js";


export class Scene extends THREE.Scene
{
    constructor()
    {
        super();

        this.frame = 1200;

        this.scene0 = new Scene0();
        this.add(this.scene0);

        //最初の位置
        this.camPos = new THREE.Vector3(0, -30, 0);//(-50, -30, -200);//正面中心に収まる位置
        // this.camTarget = new THREE.Vector3(-20, -10, -80);
        this.camTarget = new THREE.Vector3(-50,-25,-50);

        //Target指定なので都度１回だけ読むようにする
        this.camTargetBool_openingIsEnd = true;
        this.camTargetBool_A = false;
        this.camTargetBool_B = false;
        this.camTargetBool_C = false;
        this.camTargetBool_BACKSPACE = false;


        //【はじめfalseだけどtrueにして送る変数】
        //なし

        //【trueで受け取りたい関数】
        // show7Panels = true;//VRでみる、７枚パネル出すからカメラをズームアウトさせるスイッチ
        // goRoom_A;//Aを選択したらAの部屋に近づくスイッチ
        // goRoom_B;//Bを選択したらAの部屋に近づくスイッチ
        // goRoom_C;//Cを選択したらAの部屋に近づくスイッチ
        // backToPanels;//A〜Fの部屋の中にいるんだけど違う部屋いきたいから７枚パネルのとこ戻ってほしいスイッチ
    }

    setup(){//ここ呼ばれてるから空でもかいてあげないとだめ

    }

    update()
    {

        this.frame += 1;
        
        this.camPos.x += (this.camTarget.x - this.camPos.x) *0.01;
        this.camPos.y += (this.camTarget.y - this.camPos.y) *0.01;
        this.camPos.z += (this.camTarget.z - this.camPos.z) *0.01;
        this.scene0.position.set(this.camPos.x,this.camPos.y,this.camPos.z);

        // if(this.frame == 350){this.camTarget = new THREE.Vector3(220, -80,-100);}
        // if(this.frame == 700){this.camTarget = new THREE.Vector3(0,0,0);}
        // if(this.frame == 1100){this.camTarget = new THREE.Vector3(70,-80,-300);}
        // if(this.frame == 1420){this.camTarget = new THREE.Vector3(120,-30,-400);}

        if(this.frame == 350){this.camTarget = new THREE.Vector3(-150, -100,-50);}
        if(this.frame == 700){this.camTarget = new THREE.Vector3(-50,-25,-50);}//この座標が円中心座標
        if(this.frame == 1100){this.camTarget = new THREE.Vector3(70,-80,-200);}
        // if(this.frame == 1300){this.camTarget = new THREE.Vector3(-220-50,-30-25,-300-50);}
        if(this.frame == 1350){this.camTarget = new THREE.Vector3(-50,-25,-50);}


        //ここはいつもの
        this.scene0.rotation.y = 45 *Math.PI/180;
        this.scene0.update();



    }



    onKeyUp(e)
    {
        if (e.keyCode == KEYCODE.SPACE){//PC版で７枚パネル出すからカメラズームアウトしてね
            console.log("show 7 panels!");
        //   if (show7Panels == true){ //キーの代わりにくる変数
                if(this.camTargetBool_openingIsEnd == true){
                    // console.log("zoom out for 7 panels");
                    this.camTargetBool_openingIsEnd = false;
                    this.camTarget = new THREE.Vector3(-220-50,-30-25,-300-50);

                    this.camTargetBool_A = true;
                    this.camTargetBool_B = true;
                    this.camTargetBool_C = true;
                    this.camTargetBool_BACKSPACE = true;
                }
        }
        
        if (e.keyCode == KEYCODE.A){//Aの部屋に移動してね
            console.log("Please go to room_A!");
        //   if (goRoom_A == true){ //キーの代わりにくる変数
            if(this.camTargetBool_A == true){
                this.camTargetBool_A = false;
                this.camTarget = new THREE.Vector3(-50-(36*2), -25-(15*1), -50+(4*2));
                this.camTargetBool_BACKSPACE = true;
                this.camTargetBool_B = false;
                this.camTargetBool_C = false;
            }
        }

        if (e.keyCode == KEYCODE.B){//Bの部屋に移動してね
            console.log("Please go to room_B!");
        //   if (goRoom_B == true){ //キーの代わりにくる変数
            if(this.camTargetBool_B == true){
                this.camTargetBool_B = false;
                this.camTarget = new THREE.Vector3(-50-(36*5), -25-(15*4), -50+(4*5));
                this.camTargetBool_BACKSPACE = true;
                this.camTargetBool_A = false;
                this.camTargetBool_C = false;
            }
        }

        if (e.keyCode == KEYCODE.C){//Cの部屋に移動してね
            console.log("Please go to room_C!");
        //   if (goRoom_C == true){ //キーの代わりにくる変数
            if(this.camTargetBool_C == true){
                this.camTargetBool_C = false;
                this.camTarget = new THREE.Vector3(-50-(36*8), -25-(15*8), -50+(4*8));
                this.camTargetBool_BACKSPACE = true;
                this.camTargetBool_B = false;
                this.camTargetBool_A = false;
            }
        }


        if (e.keyCode == KEYCODE.BACKSPACE){//今部屋の中にいるんだけど違う部屋いきたいから７枚パネルのとこ戻ってね
            console.log("Please back to 7 panels!");
        //   if (backToPanels == true){ //キーの代わりにくる変数
            if(this.camTargetBool_BACKSPACE == true){
                this.camTargetBool_BACKSPACE = false;
                this.camTarget = new THREE.Vector3(-220-50,-30-25,-300-50);
                
                this.camTargetBool_A = true;
                this.camTargetBool_B = true;
                this.camTargetBool_C = true;
            }

        }
    }


}

export class Scene0 extends THREE.Scene
{
    constructor()
    {
        super();
    // }
    // setup()    //なぜかsetupではエラー。Cannot read property 'update' of undefined
    // {
        // this.camera = new Camera();

        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        // var spotLight = new THREE.SpotLight(0xffffff);
        // spotLight.position.set(80, 60, 50);
        // spotLight.intensity = 1;

        this.scene1 = new Scene1();
        this.add(this.scene1);

        this.scene2 = new Scene2();
        // this.scene2.add(ambientLight);
        // this.scene2.add(spotLight);
        this.add(this.scene2);
    }
    update()
    {
        // this.camera.update();
        this.scene1.update();
        this.scene2.update();
    }
}

export class Scene1 extends THREE.Scene
{
    constructor()
    {
        super();

        // this._line = [this._line1in, this._line1out,this._line2in, this._line2out];
        this._line = [this._line1in, this._line1out];

        //今は関東ー北海道だけなのでi<1
        for (let i = 0 ; i < this._line.length/2; i++){
            for (let j= 0 ; j < 2 ; j++){
                this._line[2*i+j] = new Line(i,j);
                if(j%2 ==0){this._line[2*i+j].position.set(0,0,0);}//outは0,0,0から
                else{this._line[2*i+j].position.set(150,70,150);}//inは離れたとこから
                this.add(this._line[2*i+j]);
            }
        }
        
    }
    update(){

        for (let i = 0 ; i < this._line.length ; i++){
            this._line[i].update();
        }

    }

}

export class Scene2 extends THREE.Scene
{
    constructor()
    {
        super();

        this.frame = 1200;





        this.meshList = [];//raycast用
        this.meshGroup = new THREE.Group();

        const material = new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            wireframe: true,
            opacity: 0.9,
            transparent: true,
        } );

        this.PlateNum = 320;
        this.positions = [];
        this.posTarget = [];

        for (let i = 0; i < this.PlateNum; i++) {

            this.floorsize = 27;//12;
            this.geometry = new THREE.PlaneBufferGeometry(this.floorsize, this.floorsize);
            this.mesh = new THREE.Mesh(this.geometry, material);
            this.mesh.position.set(0,0,0);
            // this.mesh.position.set(100,100,70);//ここVR
            this.mesh.rotation.x = 90 * Math.PI/180;//planeのときだけ、boxでは消す
            this.meshGroup.add(this.mesh);
            this.meshList.push(this.mesh);
            this.positions.push( this.mesh.position.x, this.mesh.position.y, this.mesh.position.z );
            this.posTarget.push(0,0,0);
        }

        this.clock = new THREE.Clock();
        this.tSpeed  =2;
        this.easeElapsedTime =0;
        this.eansingBool = true;

        this.add(this.meshGroup);

        this.openingIsEnd = false;
    }

    update()
    {
        this.frame += 1;

        if (this.eansingBool == true){

            this.easeElapsedTime += this.clock.getDelta();
            this.t = this.easeElapsedTime / this.tSpeed;
            if ( this.t > 1.0){this.t = 1.0;}    // クランプ
            this.rate = this.t * this.t * ( 3.0 - 2.0 * this.t );

            for (let i = 0; i < this.meshList.length; i++) {
                // this.meshList[i].scale = 10;//きかない
                // // console.log(this.meshList[i].geometry.width);
                // this.meshList[i].geometry.needUpdate = true;//きかない

                this.meshList[i].position.x = this.positions[3*i+ 0];
                this.meshList[i].position.y = this.positions[3*i+ 1];
                this.meshList[i].position.z = this.positions[3*i+ 2];

                for(let j=0; j<3; j++){
                    let A = this.positions[3*i+ j];
                    let B = this.posTarget[3*i+ j];
                    this.positions[3*i+ j] = A * ( 1.0 - this.rate ) + B * this.rate;
                    // this.positions[3*i+ j] += (B- A) * 0.03;
                    // if (i==319 && Math.abs(A - B)<0.01 ){this.frame = 1;}
                }
            }
        }

        //ここからアニメーション
        // if(this.clock.elapsedTime == 1){
        if(this.frame == 50){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    this.posTarget[3*i+ 0] = 25*j,
                    this.posTarget[3*i+ 1] = 0,
                    this.posTarget[3*i+ 2] = 0
                }
                }
            }
            this.easeElapsedTime = 0;
            this.tSpeed = 3.0;
        }

        // if(this.clock.elapsedTime == 2){
        if(this.frame == 110){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        this.posTarget[3*i+ 0] = 25*j,
                        this.posTarget[3*i+ 1] = 0,
                        this.posTarget[3*i+ 2] = 25*k
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
        }

        // if(this.clock.elapsedTime == 3){
        if(this.frame == 170){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 20; l++) {
                        if(i >=80*j+(20*k)+(1*l) && i<80*j+(20*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 25*j,
                            this.posTarget[3*i+ 1] = 7*l,
                            this.posTarget[3*i+ 2] = 25*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed = 4.0;
        }

        if(this.frame == 280){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 45*k,
                            this.posTarget[3*i+ 1] = 10*l,//120*Math.random(),
                            this.posTarget[3*i+ 2] = 45*j
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime = 0;
            this.tSpeed = 4.0;
        }

        if(this.frame == 430){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 45*j,
                            this.posTarget[3*i+ 1] = 0,
                            this.posTarget[3*i+ 2] = 45*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed = 7.0;
        }

        if(this.frame == 490){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 15*2*j,
                            this.posTarget[3*i+ 1] = 0
                            this.posTarget[3*i+ 2] = 15*2*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed = 4.0;
        }

        if(this.frame == 550){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 8; j++) {
                if(i >=40*j && i<40*(j+1)){
                    for (let k = 0; k < 8; k++) {
                    if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
                        for (let l = 0; l < 5; l++) {
                        if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 15*j,
                            this.posTarget[3*i+ 1] = 0,
                            this.posTarget[3*i+ 2] = 15*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed = 4.0;
        }


        if(this.frame == 600){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 8; j++) {
                if(i >=40*j && i<40*(j+1)){
                    for (let k = 0; k < 8; k++) {
                    if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
                        for (let l = 0; l < 5; l++) {
                        if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 20*j,
                            this.posTarget[3*i+ 1] =  (30*Math.sin((30*(j+k)+((this.frame+60)*2))*Math.PI/180)),
                            this.posTarget[3*i+ 2] = 20*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
        }



        if(this.frame == 660){ this.eansingBool = false;}

        if(this.frame >= 660 && this.frame < 780){

            for (let i = 0; i < this.meshList.length; i++) {
                this.meshList[i].position.x = this.positions[3*i+ 0];
                this.meshList[i].position.y = this.positions[3*i+ 1];
                this.meshList[i].position.z = this.positions[3*i+ 2];
            }

            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 8; j++) {
                if(i >=40*j && i<40*(j+1)){
                    for (let k = 0; k < 8; k++) {
                    if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
                        for (let l = 0; l < 5; l++) {
                        if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
                            this.positions[3*i+ 0] = 20*j,
                            this.positions[3*i+ 1] = (30*Math.sin((30*(j+k)+(this.frame*2))*Math.PI/180)),
                            this.positions[3*i+ 2] = 20*k
                        }
                        }
                    }
                    }
                }
                }
            }


        }


        if(this.frame == 780){ this.eansingBool = true;}

        if(this.frame == 780){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 8; j++) {
                if(i >=40*j && i<40*(j+1)){
                    for (let k = 0; k < 8; k++) {
                    if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
                        for (let l = 0; l < 5; l++) {
                        if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 80*Math.sin((i*2*Math.PI/180))+50,
                            this.posTarget[3*i+ 1] = 0+25,
                            this.posTarget[3*i+ 2] = 80*Math.cos((i*2*Math.PI/180))+50
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =30;
        }

        if(this.frame == 900){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 4*k+50,
                            this.posTarget[3*i+ 1] = 1.5*l+25,
                            this.posTarget[3*i+ 2] = 4*j+50
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =8.0;
        }



        if(this.frame == 1000){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 70*Math.sin((4*i*Math.PI/180))+50,
                            this.posTarget[3*i+ 1] = 70*Math.cos((2*20*(j+k+l)*Math.PI/180))+25,
                            this.posTarget[3*i+ 2] = -70*Math.sin((8*i*Math.PI/180))+50
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =12.0;
        }

        if(this.frame == 1150){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 25*j,
                            this.posTarget[3*i+ 1] = 0,
                            this.posTarget[3*i+ 2] = 25*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =4.0;
        }

        if(this.frame == 1270){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 20; l++) {
                        if(i >=80*j+(20*k)+(1*l) && i<80*j+(20*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 20*j,
                            this.posTarget[3*i+ 1] = 5*l,
                            this.posTarget[3*i+ 2] = 20*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =4.0;
        }

        if(this.frame == 1370){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                                this.posTarget[3*i+ 0] = 25*(j+l),
                                this.posTarget[3*i+ 1] = 15*l,
                                this.posTarget[3*i+ 2] = 25*(k+l)
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =10.0;
        }


        if(this.frame == 1470){
            if(this.openingIsEnd == false){this.openingIsEnd = true;}
        }
        // if(this.frame == 1471){
        //     if(this.openingIsEnd == true){this.openingIsEnd = false;}
        // }

    }
}