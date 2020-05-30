/**
 * Class XR.Test
 *
 * Testing VR by Three.js
 */

import * as THREE from "three/build/three.module";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VRButton } from 'three/examples/jsm/webxr/VRButton';

import { ICommonFacadeModuleObject } from "../Utils/Interfaces";
import { WebXRPermissionUtils } from "../Utils/Utils";

const App =
{
  ...ICommonFacadeModuleObject,
  props: {
  },

  setup()
  {
		let {
			scene, camera, renderer, geometry, material, cube
		} = this.props;

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		geometry = new THREE.BoxGeometry( 1, 1, 1 );
		material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

		cube = new THREE.Mesh( geometry, material );
		cube.position.set(0, 1, -2);
		scene.add( cube );

		camera.position.z = 10;

		this.props.canvas = document.querySelector('#stage').appendChild(renderer.domElement);
		renderer.xr.enabled = true;

    WebXRPermissionUtils.init();
		document.body.appendChild( VRButton.createButton( renderer ) );


    // update props
    this.props = {
      ...this.props,
      ...{
				scene, camera, renderer, geometry, material, cube
      }
    };
//    this.onResize();

		this.props.renderer.setAnimationLoop(() => {
			this.draw();
		});

  },

  update()
  {
		this.props.cube.rotation.x += 0.1;
		this.props.cube.rotation.y += 0.1;
  },

  draw()
  {
		const { renderer, scene, camera } = this.props;

		// this.update();
		renderer.render(scene, camera);
  },

  onMouseMove(evt)
  {
  },

  onResize()
  {
    const { renderer, camera } = this.props;

    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

};

export default App;


