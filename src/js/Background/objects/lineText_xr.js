



//テキスト表示
var textGeo = new THREE.TextGeometry( 'Leg', {
    size: 40, // 高さ40
    curveSegments: 1, // 字曲線分割数1。カクカク。eが8角形に見える。
    height:20, // 厚さ20
    // フォント指定しないとhelvetikerの非ボールド、非イタリックに
    bevelEnabled: true, bevelSize: 3, bevelThickness: 5, bevelSegments: 2
    // ベベル有効、3太らせる、5伸ばす、ベベル分割数2    
    });
    var greenMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    var text = new THREE.Mesh( textGeo, greenMaterial );