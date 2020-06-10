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
    
            console.log(this.where);
            
            var geo = new Float32Array( 40 * 3 );//点は40個、長さは/10000000*0.5
            for( var j = 0; j < geo.length; j += 3 ) {
                // //最初の点の位置。全部いれてる
                geo[ j + 0 ] = 500*Math.sin(((this.where* 51.429)+ (0.5* j/3))* -Math.PI/180);
                geo[ j + 1 ] = 0;
                geo[ j + 2 ] = 500*Math.cos(((this.where* 51.429)+ (0.5* j/3))* -Math.PI/180);
                console.log(this.where);
                console.log(j/3);

                // geo[ j + 0 ] = 100;
                // geo[ j + 1 ] = 0;
                // geo[ j + 2 ] = 100;
            }

            var g = new MeshLine();
            g.setGeometry( geo, function( p ) { return p; } );//function( p ) 


            let material = new MeshLineMaterial( {
                color: 0x4ea78e,
                lineWidth: 0.6,//0.6
                depthTest: false,//これがないと隠れちゃって描画されなかった。。。
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

            //これがないと生えていかない。
            for( var j = 0; j < geo.length; j+= 3 ) {
                // geo[ j ] = geo[ j + 3 ] * 1.0;
                geo[ j + 1 ] = geo[ j + 4 ] * 1.0;
                // geo[ j + 2 ] = geo[ j + 5 ] * 1.0;
            }

            this.getlineLength();

            // geo[ geo.length - 3 ] = geo[ geo.length - 6 ];
            geo[ geo.length - 2 ] = this.lineLength;
            // geo[ geo.length - 1 ] = geo[ geo.length - 4 ];
            g.setGeometry( geo );
        }


        getlineLength(){

                this.lineLength = this.data[this.Times][2*0+ this.inout]*1.5;//長さ調整

                // if(this.Times > 1800){this.Times = 1800 +2;}
                this.Times += 1;//0行目を題名にする場合は上のifの前におく
                return this.lineLength;

        }


        loadCSVandConvertToArray2D()//2回よばれるの気になる
        {

            //いつもはこっち
            loadCSV("../data/kanto_all.csv", e =>
            {
                const result = e.result;
                let data = convertCSVtoArray2D(result);
                this.doSomething(data);

                // console.group();
                // console.log("Data from csv");
                // console.dir(this.data);
                // console.log(this.data[0][0]);
                // console.groupEnd();

            });

            // console.log(this.data[0][0]);//これは表示されない

        }


        doSomething(data){
            this.DATAisOK = true;
            this.data = data;
            console.log(this.data[0][0]);
        }


        update(){
            if(this.DATAisOK ==  true){
                if(this.frame < 1800){
                    this.frame += 1;
                    if(this.frame% 4 == 0){//２回に１回
                        for( var i in this.meshes ) { this.checkIntersection(i); }
                    }
                }else{ 
                    this.frame = 1800 +2;//1800以上は読まないよー あれ、1800だと読んでしまう
                }
            }
        }


    }
    
    