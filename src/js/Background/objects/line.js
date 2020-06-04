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
            


            this.meshes = {};//planeけしてみた

            if( !this.meshes[ 0 ] ) { this.meshes[ 0 ] = this.prepareMesh(); }

            this.lineLength = 0;
            this.where = where;
            this.inout = inout;
            
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
    
            var geo = new Float32Array( 100 * 3 );//点は40個、長さは/10000000*0.5
            for( var j = 0; j < geo.length; j += 3 ) {
                geo[ j ] = geo[ j + 1 ] = geo[ j + 2 ] = 0;//最初の点の位置。全部いれてる
            }
    
            var g = new MeshLine();
            g.setGeometry( geo, function( p ) { return p; } );//function( p ) 


            let material = new MeshLineMaterial( {
                color: 0xF549C1,
                lineWidth: 0.8,//0.6
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
                geo[ j ] = geo[ j + 3 ] * 1.0;
                geo[ j + 1 ] = geo[ j + 4 ] * 1.0;
                geo[ j + 2 ] = geo[ j + 5 ] * 1.0;
            }


            let Randomselect = Math.random();//xyzどの軸に伸ばすか方向を決める
            // let lineLength = 100 * (2*Math.random()-1) ;
            this.getlineLength();
            let RandomDir = Math.random();
            if(RandomDir <0.5){this.lineLength *= -1;}
            else{this.lineLength *= 1;}//なぜかわかんないけどこれいれないとマイナスにしかライン走らなくなる
            // console.log(this.lineLength);


            if(Randomselect >0.66){	
    
                if(geo[ geo.length - 6 ]>90 && this.lineLength>0){this.lineLength *= -1;}
                if(geo[ geo.length - 6 ]<-45&& this.lineLength<0){this.lineLength *= -1;}
                geo[ geo.length - 3 ] = geo[ geo.length - 6 ] +this.lineLength;
                geo[ geo.length - 2 ] = geo[ geo.length - 5 ];
                geo[ geo.length - 1 ] = geo[ geo.length - 4 ];
    
            }else if(Randomselect >0.33){
    
                if(geo[ geo.length - 5 ]>90 && this.lineLength>0){this.lineLength *= -1;}
                if(geo[ geo.length - 5 ]<-45&& this.lineLength<0){this.lineLength *= -1;}
                geo[ geo.length - 3 ] = geo[ geo.length - 6 ];
                geo[ geo.length - 2 ] = geo[ geo.length - 5 ] +this.lineLength;
                geo[ geo.length - 1 ] = geo[ geo.length - 4 ];
    
            }else{
    
                if(geo[ geo.length - 4 ]>90 && this.lineLength>0){this.lineLength *= -1;}
                if(geo[ geo.length - 4 ]<-45&& this.lineLength<0){this.lineLength *= -1;}
                geo[ geo.length - 3 ] = geo[ geo.length - 6 ];
                geo[ geo.length - 2 ] = geo[ geo.length - 5 ];
                geo[ geo.length - 1 ] = geo[ geo.length - 4 ] +this.lineLength;
            }
            g.setGeometry( geo );
        }

        getlineLength(){


            //https://uxmilk.jp/11586
            // let count60frm = 0;
            // count60frm +=1;
            // if(count60frm%(60/4) ==0){
                
                //Where: 関東ー北海道 = 0, 関東ー中部 = 1,,,
                //InOut: in=1, out=2;


                this.lineLength = this.data[this.Times][2*this.where + this.inout]/10000000*0.3;
                // this.lineLength = this.data[0][0];
                // //10^-8して小さくしてる
                // this.lineLength = this.data[this.Times][2*this.where + this.inout]*pow(10,-9);

                // this.lineLength = this.result[0][1];
                this.Times += 1;//0行目は題名にする場合はここにおく
                if(this.Times == 12){this.Times = 0;}

                return this.lineLength;

            // }
        }

        loadCSVandConvertToArray2D()//2回よばれるの気になる
        {
            loadCSV("../../../../data/kanto_hokkaido.csv", e =>
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
                this.frame += 1;
                if(this.frame% 4 == 0){
                    for( var i in this.meshes ) { this.checkIntersection(i); }
                }
            }
        }


    }
    
    