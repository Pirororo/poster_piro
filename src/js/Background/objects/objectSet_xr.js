import * as THREE from "three";

export default class ObjectSet extends THREE.Object3D {

    /**
    * コンストラクターです。
    * @constructor
    */
    constructor(){
        super();

        this.frame = 0;
    
    //☆床サークル
        // 空のジオメトリを作成
        const Circle_NUM = 10;
        const Circlegeometry = new THREE.Geometry()
        // Circle
        for (let i = 0; i < Circle_NUM; i++) {
            // 立方体個別の要素を作成
            const CirclesampleGeometry = new THREE.CircleGeometry(
                900/Circle_NUM*i,
                7//７角形
            );
            // 座標調整の行列を作成
            const Circlematrix = new THREE.Matrix4();
            Circlematrix.makeTranslation(
                0+(160), 0+(160), 0
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
            // color: 0xff0000,
            // side: THREE.DoubleSide,
            opacity: 0.8,
            transparent: true,
            // blending: THREE.AdditiveBlending
        } );

        this.circle = new THREE.Mesh( Circlegeometry, Circlematerial );
        this.circle.rotation.x = 90*Math.PI/180;
        this.circle.rotation.z = -11*Math.PI/180;
        this.add(this.circle);



    //☆ボックス
        // 空のジオメトリを作成
        const CELL_NUM = 560;
        const Billgeometry = new THREE.Geometry();
        // Box
        let angleTerm = 0;
        for (let i = 0; i < CELL_NUM; i++) {
            // 立方体個別の要素を作成
            let y = 60*(Math.random()+0.5);
            const BillsampleGeometry = new THREE.BoxGeometry(
                10*(Math.random()+0.5),
                y,
                10*(Math.random()+0.5)
            );
            // 座標調整の行列を作成
            const Billmatrix = new THREE.Matrix4();
            // matrix.makeTranslation(
            //     // 20 * (i - CELL_NUM / 2),
            //     // 0,
            //     // 20 * (j - CELL_NUM / 2)
            if(i%80 == 0){angleTerm += 1;}
            Billmatrix.makeTranslation(
                (i%10-5)*20+ (800*Math.sin((angleTerm*51.429)*Math.PI/180))+(160),
                y/2,
                (i%8-4)*20+ (800*Math.cos((angleTerm*51.429)*Math.PI/180))+(160)
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


        
        
    //☆放射線
        // 空のジオメトリを作成
        const SPline_NUM = 7;
        const SPlinegeometry = new THREE.Geometry();
        
        for (let i = 0; i < SPline_NUM; i++) {
            // 立方体個別の要素を作成
            const meshTemp = new THREE.Mesh( new THREE.PlaneGeometry(3,1600));

            meshTemp.position.set(160,0,160);
            meshTemp.rotation.x = 90*Math.PI/180;
            meshTemp.rotation.z = (i*51.4 -14)*Math.PI/180;
            // meshTemp.rotation.z = 90* Math.PI/180;


            // メッシュをマージ（結合）
            SPlinegeometry.mergeMesh(meshTemp);
        }
        // マテリアルを作成
        const SPlinematerial = new THREE.MeshBasicMaterial( {
            // color: 0xC7C7C7,
            // wireframe: true,
            side: THREE.BackSide,
            color: 0x4ea78e,
            opacity: 0.9,
            transparent: true,
            blending: THREE.AdditiveBlending,
        } );

        // メッシュを作成
        this.SPlinemesh = new THREE.Mesh(SPlinegeometry, SPlinematerial);
        // this.add(this.SPlinemesh);


    //☆リング
        this.RingRadius = 300;
        this.RingGeometry = new THREE.RingGeometry(290,300,7,1,10);//最後がシータスタート
        const Ringmaterial = new THREE.MeshBasicMaterial( {
            side: THREE.DoubleSide,
            color: 0x4ea78e,
            opacity: 0.9,
            transparent: true,
        } );
        this.Ringmesh = new THREE.Mesh(this.RingGeometry, Ringmaterial); 
        this.Ringmesh.position.set(160, 0, 160);
        this.Ringmesh.rotation.x = 90 * Math.PI/180;
        // this.add(this.Ringmesh);

 
    }

    update(){
    
        // if(this.frame < 1000){
        //     this.frame += 1;
        // }else{
        //     this.frame = 0;
        // }
        // this.RingRadius = this.frame;
        // this.RingGeometry = new THREE.TorusGeometry(this.RingRadius, 1, 64, 4);
        // this.RingGeometry.verticesNeedUpdate=true;

        // this.circle.rotation.x = 90*Math.PI/180;

    }
}
