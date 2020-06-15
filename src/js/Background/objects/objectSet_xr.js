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

            // ジオメトリをマージ（結合）
            Circlegeometry.merge(CirclesampleGeometry, Circlematrix);
        }

        // マテリアルを作成
        const Circlematerial = new THREE.MeshBasicMaterial( {
            wireframe: true,
            color: 0x4ea78e,
            opacity: 0.8,
            transparent: true
        } );

        this.circle = new THREE.Mesh( Circlegeometry, Circlematerial );
        this.circle.rotation.x = 90*Math.PI/180;
        this.add(this.circle);

        let angleTerm = 0;


    //☆名前パネル
        // マテリアルを作成
        let loader = new THREE.TextureLoader();
        this.Namematerial = [
            new THREE.MeshBasicMaterial({
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                map: loader.load( '../img/namePanels/namePanels-01.png' 
                )}),
            new THREE.MeshBasicMaterial({
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                map: loader.load( '../img/namePanels/namePanels-02.png' 
                )}),
            new THREE.MeshBasicMaterial({
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                map: loader.load( '../img/namePanels/namePanels-03.png' 
                )}),
            new THREE.MeshBasicMaterial({
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                map: loader.load( '../img/namePanels/namePanels-04.png' 
                )}),
            new THREE.MeshBasicMaterial({
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                map: loader.load( '../img/namePanels/namePanels-05.png' 
                )}),
            new THREE.MeshBasicMaterial({
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                map: loader.load( '../img/namePanels/namePanels-06.png' 
                )}),
            new THREE.MeshBasicMaterial({
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                map: loader.load( '../img/namePanels/namePanels-07.png' 
                )})
        ];


        // 空のジオメトリを作成
        const NAME_NUM = 7;
        // Box
        this.meshgroup = new THREE.Group();
        angleTerm = 0;
        for (let i = 0; i < NAME_NUM; i++) {
            this.Namegeometry = new THREE.PlaneGeometry(330,110);//330,127
            this.Namemesh = new THREE.Mesh(this.Namegeometry,this.Namematerial[i]);

            if(i%1 == 0){angleTerm += 1;}
            this.Namemesh.rotation.y = (angleTerm*51.429+180)*Math.PI/180;
            this.Namemesh.position.set(
                (700*Math.sin((angleTerm*51.4286-7)*Math.PI/180))+(0),//-7//-10
                (i%1)*30+320,
                (700*Math.cos((angleTerm*51.4286-7)*Math.PI/180))+(0)
            );
            this.meshgroup.add(this.Namemesh);

        }
        this.add(this.meshgroup);

    }


    update(){

    }

}
