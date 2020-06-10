import * as THREE from "three";

export default class Plate extends THREE.Object3D {

    /**
    * コンストラクターです。
    * @constructor
    */
    constructor(){
        super();

        this.frame = 0;

        // 空のジオメトリを作成
        const Circle_NUM = 30;
        const Circlegeometry = new THREE.Geometry()
        // Circle
        for (let i = 0; i < Circle_NUM; i++) {
            // 立方体個別の要素を作成
            this.CircleRadius = 1000*Math.random();
            const CirclesampleGeometry = new THREE.CircleGeometry(
                this.CircleRadius,
                7
            );
            // 座標調整の行列を作成
            const Circlematrix = new THREE.Matrix4();
            Circlematrix.makeTranslation(
                0+125,0+125,0
            );
            // if(i%70 == 0){angleTerm += 1;}
            // matrix.makeTranslation(
            //     140*(2*Math.random()-1)+ 400*Math.sin(angleTerm*50*Math.PI/180),
            //     0,
            //     140*(2*Math.random()-1)+ 400*Math.cos(angleTerm*50*Math.PI/180)
            // );

            // ジオメトリをマージ（結合）
            Circlegeometry.merge(CirclesampleGeometry, Circlematrix);
        }

        // マテリアルを作成
        const Circlematerial = new THREE.MeshBasicMaterial( {
            // color: 0xC7C7C7,
            wireframe: true,
            // visible:true,
            color: 0x4ea78e,
            // color: 0x0000ff,
            opacity: 0.9,
            transparent: true,
            // blending: THREE.AdditiveBlending
        } );

        this.circle = new THREE.Mesh( Circlegeometry, Circlematerial );
        this.add(this.circle);



        // 空のジオメトリを作成
        const CELL_NUM = 490;
        const Billgeometry = new THREE.Geometry();
        // Box
        let angleTerm = 0;
        for (let i = 0; i < CELL_NUM; i++) {
            // 立方体個別の要素を作成
            let y = 40*(Math.random()+0.5);
            const BillsampleGeometry = new THREE.BoxGeometry(
                8*(Math.random()+0.5),
                y,
                8*(Math.random()+0.5)
            );
            // 座標調整の行列を作成
            const Billmatrix = new THREE.Matrix4();
            // matrix.makeTranslation(
            //     // 20 * (i - CELL_NUM / 2),
            //     // 0,
            //     // 20 * (j - CELL_NUM / 2)
            if(i%70 == 0){angleTerm += 1;}
            Billmatrix.makeTranslation(
                100*(2*Math.random()-1)+ 800*Math.sin(angleTerm*51*Math.PI/180)+125,
                y/2,
                100*(2*Math.random()-1)+ 800*Math.cos(angleTerm*51*Math.PI/180)+125
            );


            // ジオメトリをマージ（結合）
            Billgeometry.merge(BillsampleGeometry, Billmatrix);
        }
        // マテリアルを作成
        const Billmaterial = new THREE.MeshBasicMaterial( {
            // color: 0xC7C7C7,
            wireframe: true,
            color: 0x4ea78e,
            opacity: 0.4,
            transparent: true,
            blending: THREE.AdditiveBlending,
        } );

        // メッシュを作成
        const Billmesh = new THREE.Mesh(Billgeometry, Billmaterial);
        this.add(Billmesh);
 
    }

    update(){
    
        
        if(this.frame < 1000){
            this.frame += 1;
        }else{
            this.frame = 0;
        }

        this.CircleRadius = this.frame;
        this.circle.rotation.x = 90*Math.PI/180;

    }
}
