


import {MeshLine, MeshLineMaterial} from "three.meshline";
import * as THREE from "three";

export default class Line extends THREE.Object3D {

        /**
        * コンストラクターです。
        * @constructor
        */
        constructor(){
            super();
            
            this.frame = 0;
            this.Times = 0;
    

            this.prepareMesh = this.prepareMesh.bind(this);
            this.checkIntersection = this.checkIntersection.bind(this);
            this.getlineLength = this.getlineLength.bind(this);;


            this.meshes = {};//planeけしてみた

            if( !this.meshes[ 0 ] ) { this.meshes[ 0 ] = this.prepareMesh(); }

        }


    
        prepareMesh() {
    
            var geo = new Float32Array( 6 * 3 );//点は200個
            for( var j = 0; j < geo.length; j += 3 ) {
                geo[ j ] = geo[ j + 1 ] = geo[ j + 2 ] = 0;//最初の点の位置。全部いれてる
            }
    
            var g = new MeshLine();
            g.setGeometry( geo, function( p ) { return p; } );//function( p ) 


            let material = new MeshLineMaterial( {
                color: 0xffff00,
                lineWidth: 0.6,//0.4
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
            this.getlineLength(Where,InOut);



            if(Randomselect >0.66){	
    
                if(geo[ geo.length - 6 ]>90 && lineLength>0){lineLength *= -1;}
                if(geo[ geo.length - 6 ]<-90&& lineLength<0){lineLength *= -1;}
                geo[ geo.length - 3 ] = geo[ geo.length - 6 ] +lineLength;
                geo[ geo.length - 2 ] = geo[ geo.length - 5 ];
                geo[ geo.length - 1 ] = geo[ geo.length - 4 ];
    
            }else if(Randomselect >0.33){
    
                if(geo[ geo.length - 5 ]>90 && lineLength>0){lineLength *= -1;}
                if(geo[ geo.length - 5 ]<-90&& lineLength<0){lineLength *= -1;}
                geo[ geo.length - 3 ] = geo[ geo.length - 6 ];
                geo[ geo.length - 2 ] = geo[ geo.length - 5 ] +lineLength;
                geo[ geo.length - 1 ] = geo[ geo.length - 4 ];
    
            }else{
    
                if(geo[ geo.length - 4 ]>90 && lineLength>0){lineLength *= -1;}
                if(geo[ geo.length - 4 ]<-90&& lineLength<0){lineLength *= -1;}
                geo[ geo.length - 3 ] = geo[ geo.length - 6 ];
                geo[ geo.length - 2 ] = geo[ geo.length - 5 ];
                geo[ geo.length - 1 ] = geo[ geo.length - 4 ] +lineLength;
            }
            g.setGeometry( geo );
        }


        update(Where,InOut){
            this.frame += 1;
            if(this.frame% 4 == 0){for( var i in this.meshes ) { 
                this.checkIntersection(Where, InOut); 
            }}
        }


        getlineLength(Where,InOut){

            //https://uxmilk.jp/11586
            // let count60frm = 0;
            // count60frm +=1;
            // if(count60frm%(60/4) ==0){
                
                //Where: 関東ー北海道 = 0, 関東ー中部 = 2,,,
                //InOut: in=1, out=2;

                let lineLength = result[Times][2*Where + InOut];
                Times += 1;//0行目は題名にする場合はここにおく

                let result=[];
                result = [
                    ['0001',50,'13',],
                    ['0002','20','15'],
                    ['0003','30','42']
                ];
            // }
        }
    
    }
    
    