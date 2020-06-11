// import {MeshLine, MeshLineMaterial} from "../three.meshline_piro/src/THREE.MeshLine";
import {MeshLine, MeshLineMaterial} from "three.meshline";
import * as THREE from "three";
import { convertCSVtoArray2D, loadCSV } from "../../Utils/AssetsLoader";


export default class Line extends THREE.Object3D {

        /**
        * コンストラクターです。
        * @constructor
        */
        constructor(where,inout){
            super();
            
            this.frame = 0;
            this.Times = 0;

        // }
        // setup(Where, InOut){

            this.prepareMesh = this.prepareMesh.bind(this);
            this.checkIntersection = this.checkIntersection.bind(this);
            this.getlineLength = this.getlineLength.bind(this);
            this.loadCSVandConvertToArray2D = this.loadCSVandConvertToArray2D.bind(this);
            this.doSomething = this.doSomething.bind(this);
            this.showText = this.showText.bind(this);

            // this.showText();
            // this.add(this.text);

            // var loader = new THREE.FontLoader();
            // loader.load('helvetiker_regular.typeface.json', function(font){
            //     var textGeometry = new THREE.TextGeometry("Hello Three.js!", {
            //         font: font,
            //         size: 20,
            //         height: 5,
            //         curveSegments: 12
            //     });
            //     var materials = [
            //         new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: 0.5 } ),
            //         new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
            //     ];
            //     var textMesh = new THREE.Mesh(textGeometry, materials);
            //     this.add(textMesh);
            // });




            this.lineLength = 0;
            this.where = where;
            this.inout = inout;

            this.meshes = {};//planeけしてみた

            if( !this.meshes[ 0 ] ) { this.meshes[ 0 ] = this.prepareMesh(); }


            this.data = [];
            this.loadCSVandConvertToArray2D();
            this.DATAisOK = false;

            //データの並べ方
            // _line[]     >1in, 1out,2in, 2out,3in, 3out,4in, 4out
            // where/inout >0/1, 0/2, 1/1, 1/2, 2/1, 2/2, 3/1, 3/2
            // this.data = [
            //     ['0001','50','13','50','13','20','15','20','15'],
            //     ['0002','20','15','20','15','50','13','50','13'],
            //     ['0003','30','42','30','42','20','15','20','15'],
            //     ['0004','50','13','50','13','50','13','50','13'],
            //     ['0005','20','15','20','15','30','42','30','42'],
            //     ['0006','30','42','30','42','30','42','30','42'],
            // ];

        }


        prepareMesh() {


            var geo = new Float32Array( 40 * 3 );//点は40個、長さは/10000000*0.5
            for( var j = 0; j < geo.length; j += 3 ) {
                // //最初の点の位置。全部いれてる
                geo[ j + 0 ] = 600*Math.sin((((this.where-1)* 51.4286)+ (0.75* j/3)-5.5)* -Math.PI/180);
                geo[ j + 1 ] = 0;
                geo[ j + 2 ] = 600*Math.cos((((this.where-1)* 51.4286)+ (0.75* j/3)-5.5)* -Math.PI/180);
                // console.log(this.where);
                // console.log(j/3);

            }

            var g = new MeshLine();
            g.setGeometry( geo, function( p ) { return p; } );//function( p ) 


            let material = new MeshLineMaterial( {
                color: 0x4ea78e,//0x4ea78e,0x4F95BD
                lineWidth: 1.1,//0.6
                depthTest: false,//これがないと隠れちゃって描画されなかった。。。
                opacity: 0.8,
                transparent: true,
                blending: THREE.AdditiveBlending
            });
    
            
            this.mesh = new THREE.Mesh( g.geometry, material );//.geometry = new THREE.BufferGeometry()
            this.mesh.geo = geo;
            this.mesh.g = g;

            this.add( this.mesh );

            return this.mesh;
        }
    
    
        checkIntersection(){
    
            this.mesh = this.meshes[ 0 ];
            var geo = this.mesh.geo;
            var g = this.mesh.g;

            //これがないと生えていかない。更新はyだけ
            for( var j = 0; j < geo.length; j+= 3 ) {
                geo[ j + 1 ] = geo[ j + 4 ] * 1.0;
            }

            this.getlineLength();

            //更新はyだけ
            geo[ geo.length - 2 ] = this.lineLength;

            g.setGeometry( geo );
        }


        getlineLength(){

            if(this.Times > 1400){this.Times = 0;}
            this.lineLength = this.data[this.Times][2*this.where+ this.inout]*0.5;//長さ調整

            this.Times += 1;//0行目を題名にする場合は上のifの前におく
            
            return this.lineLength;

        }


        loadCSVandConvertToArray2D()//2回よばれるの気になる
        {

            loadCSV("../data/kanto_7area.csv", e =>
            {
                const result = e.result;
                let data = convertCSVtoArray2D(result);
                this.doSomething(data);
            });
        }


        doSomething(data){
            this.DATAisOK = true;
            this.data = data;
            // console.log(this.data[0][0]);
        }


        showText(){

            // //テキスト表示
            // var textGeo = new THREE.TextGeometry( 'Leg', {
            //     size: 40, // 高さ40
            //     curveSegments: 1, // 字曲線分割数1。カクカク。eが8角形に見える。
            //     height:20, // 厚さ20
            //     // フォント指定しないとhelvetikerの非ボールド、非イタリックに
            //     bevelEnabled: true, bevelSize: 3, bevelThickness: 5, bevelSegments: 2
            //     // ベベル有効、3太らせる、5伸ばす、ベベル分割数2    
            // });
            // var greenMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
            // this.text = new THREE.Mesh( textGeo, greenMaterial );

        }


        update(){
            if(this.DATAisOK ==  true){
                if(this.frame < 1800){
                    this.frame += 1;
                    if(this.frame% 2 == 0){//２回に１回
                        for( var i in this.meshes ) { this.checkIntersection(i); }
                    }
                }else{ 
                    this.frame = 0;
                    // this.frame = 1800 +2;
                }
            }
        }


    }
    
    