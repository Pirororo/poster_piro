/**
 * Class XR.App
 *
 * Mainclass of XR App
 */

import { ICommonFacadeModuleObject } from "../Utils/Interfaces";
import "aframe-state-component";
import * as THREE from "three";
import { SELECTORS } from "./../Utils/Props";

import Background_App from "../Background/App_xr";
import { Scene as Background_Scene } from "../Background/scene/scene_xr";
import Gallery_App from "../Gallery/App_xr";

const AFRAME = window.AFRAME;
const App =
{
	...ICommonFacadeModuleObject,
	props: {},
	setup()
	{
		this.props.xr_player = document.getElementById(SELECTORS.XRPlayer);

		AFRAME.registerComponent('module-background',
		{
			props: {},
			modules: {
				background: {}
			},
			init()
			{
				this.props.scene = this.el.object3D;
				// scene = this.props.scene;

				this.modules.background.scene = new Background_Scene();
				this.modules.background.scene.setup();//.call(this.props.scene);
				this.modules.background.app = new Background_App(this.modules.background.scene);
				// this.modules.background.app.setup();

				// attach each scenes to AFrame root scene
				this.props.scene.add(this.modules.background.scene);

				// document.addEventListener("click", e => this.modules.background.scene.onClick(e));
				document.addEventListener("keyup", e => this.modules.background.scene.onKeyUp(e));
			},
			update()
			{
				console.log("Scene update");
			},

			tick()
			{
				this.modules.background.app.update();
			}
		});

		/**
		 * Module Gallery
		 */
		AFRAME.registerComponent('module-gallery',
		{
			props: {},
			modules: {
				gallery: {}
			},
			init()
			{
				console.log("Module gallery");
				this.props.scene = this.el.object3D;
				this.props.camera = document.getElementById(SELECTORS.XRCamera).object3D;

				setTimeout(() => {
					this.modules.gallery.app = new Gallery_App();
					this.modules.gallery.app.init(this.el, this.props.camera);
				}, 1000);

				// this.props.scene.add(this.modules.gallery.app.getScene());
				// attach each scenes to AFrame root scene
				// this.props.scene.add(this.modules.gallery.app.getScene());
			},

			tick()
			{
				// const direction = getCameraDirection(this.props.camera);
				if (this.props.camera == null || this.modules.gallery.app == null)
				{
					return;
				}

				const pLocal = new THREE.Vector3( 0, 0, -1 );
				const pWorld = pLocal.applyMatrix4( this.props.camera.matrixWorld );
				const direction = pWorld.sub( this.el.object3D.position ).normalize();

				this.modules.gallery.app.draw(direction);
			}
		});

		AFRAME.registerComponent('collider-check',
		{
			dependencies: ['raycaster'],
			props: {},
			init: function()
			{
				console.log("Module collider-check");

				this.el.addEventListener('raycaster-intersection', function (e)
				{
					const targets = e.detail.intersections;
					if (targets.length > 0)
					{
						targets[0].object.material.color.set(0xffffff);
					}
				});
				this.el.addEventListener('raycaster-intersection-cleared', function (e) {

					const targets = e.detail.clearedEls;
					for ( var i = 0; i < targets.length; i++ ) {
						// console.dir(targets[i]);
						targets[i].object3DMap.mesh.material.color.set(0x222222);
					}
				});

			}
		});

		if (this.props.xr_player != null)
		{
			this.props.xr_player.setAttribute("collider-check");
		}
	}
};

export default App;