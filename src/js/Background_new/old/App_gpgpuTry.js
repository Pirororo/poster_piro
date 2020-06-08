			import * as THREE from "three";

			//fps表示とDAT表示に必要なjs
            import {GUI} from 'three/examples/jsm/libs/dat.gui.module';
            import Stats from "three/examples/jsm/libs/stats.module";

			//カメラ系に必要なjs
            import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
            import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
            
            // シェーダーソース
            import computeShaderPosition from './shaders/position.frag';
            import computeShaderVelocity from './shaders/velocity.frag';
            import particleVertexShader from './shaders/particleVert.vert';
            import particleFragmentShader from './shaders/particleFrag.frag';




        export default class App{

            constructor(){


			var isIE = /Trident/i.test( navigator.userAgent );
			var isEdge = /Edge/i.test( navigator.userAgent );

			// Texture width for simulation (each texel is a debris particle)
			var WIDTH = ( isIE || isEdge ) ? 4 : 64;

			var container, stats;
			var camera, scene, renderer, geometry;

			var PARTICLES = WIDTH * WIDTH;

			var gpuCompute;
			var velocityVariable;
			var positionVariable;
			var velocityUniforms;
			var particleUniforms;
			var effectController;

			init();
            animate();
            
            }

			init() {

				// container = document.createElement( 'div' );
				// document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 5, 15000 );
				camera.position.y = 120;
				camera.position.z = 400;

				scene = new THREE.Scene();

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				var controls = new OrbitControls( camera, renderer.domElement );
				controls.minDistance = 100;
				controls.maxDistance = 1000;

				effectController = {
					// Can be changed dynamically
					gravityConstant: 100.0,
					density: 0.45,

					// Must restart simulation
					radius: 300,
					height: 8,
					exponent: 0.4,
					maxMass: 15.0,
					velocity: 70,
					velocityExponent: 0.2,
					randVelocity: 0.001
				};

				initComputeRenderer();

				stats = new Stats();
				container.appendChild( stats.dom );

				window.addEventListener( 'resize', onWindowResize, false );

				initGUI();

				initProtoplanets();

				dynamicValuesChanger();

			}

			initComputeRenderer() {

				gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );

				var dtPosition = gpuCompute.createTexture();
				var dtVelocity = gpuCompute.createTexture();

				fillTextures( dtPosition, dtVelocity );

				// velocityVariable = gpuCompute.addVariable( "textureVelocity", document.getElementById( 'computeShaderVelocity' ).textContent, dtVelocity );
                // positionVariable = gpuCompute.addVariable( "texturePosition", document.getElementById( 'computeShaderPosition' ).textContent, dtPosition );
                velocityVariable = gpuCompute.addVariable( "textureVelocity", computeShaderVelocity, dtVelocity );
				positionVariable = gpuCompute.addVariable( "texturePosition", computeShaderPosition, dtPosition );


				gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
				gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );

				velocityUniforms = velocityVariable.material.uniforms;

				velocityUniforms[ "gravityConstant" ] = { value: 0.0 };
				velocityUniforms[ "density" ] = { value: 0.0 };

				var error = gpuCompute.init();

				if ( error !== null ) {

					console.error( error );

				}

			}

			restartSimulation() {

				var dtPosition = gpuCompute.createTexture();
				var dtVelocity = gpuCompute.createTexture();

				fillTextures( dtPosition, dtVelocity );

				gpuCompute.renderTexture( dtPosition, positionVariable.renderTargets[ 0 ] );
				gpuCompute.renderTexture( dtPosition, positionVariable.renderTargets[ 1 ] );
				gpuCompute.renderTexture( dtVelocity, velocityVariable.renderTargets[ 0 ] );
				gpuCompute.renderTexture( dtVelocity, velocityVariable.renderTargets[ 1 ] );

			}

			initProtoplanets() {

				geometry = new THREE.BufferGeometry();

				var positions = new Float32Array( PARTICLES * 3 );
				var p = 0;

				for ( var i = 0; i < PARTICLES; i ++ ) {

					positions[ p ++ ] = ( Math.random() * 2 - 1 ) * effectController.radius;
					positions[ p ++ ] = 0; //( Math.random() * 2 - 1 ) * effectController.radius;
					positions[ p ++ ] = ( Math.random() * 2 - 1 ) * effectController.radius;

				}

				var uvs = new Float32Array( PARTICLES * 2 );
				p = 0;

				for ( var j = 0; j < WIDTH; j ++ ) {

					for ( var i = 0; i < WIDTH; i ++ ) {

						uvs[ p ++ ] = i / ( WIDTH - 1 );
						uvs[ p ++ ] = j / ( WIDTH - 1 );

					}

				}

				geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
				geometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

				particleUniforms = {
					"texturePosition": { value: null },
					"textureVelocity": { value: null },
					"cameraConstant": { value: getCameraConstant( camera ) },
					"density": { value: 0.0 }
				};

				// THREE.ShaderMaterial
				var material = new THREE.ShaderMaterial( {
					uniforms: particleUniforms,
					// vertexShader: document.getElementById( 'particleVertexShader' ).textContent,
                    // fragmentShader: document.getElementById( 'particleFragmentShader' ).textContent
                    vertexShader: particleVertexShader,
					fragmentShader: particleFragmentShader
				} );

				material.extensions.drawBuffers = true;

				var particles = new THREE.Points( geometry, material );
				particles.matrixAutoUpdate = false;
				particles.updateMatrix();

				scene.add( particles );

			}

			fillTextures( texturePosition, textureVelocity ) {

				var posArray = texturePosition.image.data;
				var velArray = textureVelocity.image.data;

				var radius = effectController.radius;
				var height = effectController.height;
				var exponent = effectController.exponent;
				var maxMass = effectController.maxMass * 1024 / PARTICLES;
				var maxVel = effectController.velocity;
				var velExponent = effectController.velocityExponent;
				var randVel = effectController.randVelocity;

				for ( var k = 0, kl = posArray.length; k < kl; k += 4 ) {

					// Position
					var x, y, z, rr;

					do {

						x = ( Math.random() * 2 - 1 );
						z = ( Math.random() * 2 - 1 );
						rr = x * x + z * z;

					} while ( rr > 1 );

					rr = Math.sqrt( rr );

					var rExp = radius * Math.pow( rr, exponent );

					// Velocity
					var vel = maxVel * Math.pow( rr, velExponent );

					var vx = vel * z + ( Math.random() * 2 - 1 ) * randVel;
					var vy = ( Math.random() * 2 - 1 ) * randVel * 0.05;
					var vz = - vel * x + ( Math.random() * 2 - 1 ) * randVel;

					x *= rExp;
					z *= rExp;
					y = ( Math.random() * 2 - 1 ) * height;

					var mass = Math.random() * maxMass + 1;

					// Fill in texture values
					posArray[ k + 0 ] = x;
					posArray[ k + 1 ] = y;
					posArray[ k + 2 ] = z;
					posArray[ k + 3 ] = 1;

					velArray[ k + 0 ] = vx;
					velArray[ k + 1 ] = vy;
					velArray[ k + 2 ] = vz;
					velArray[ k + 3 ] = mass;

				}

			}

			onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				particleUniforms[ "cameraConstant" ].value = getCameraConstant( camera );

			}

			dynamicValuesChanger() {

				velocityUniforms[ "gravityConstant" ].value = effectController.gravityConstant;
				velocityUniforms[ "density" ].value = effectController.density;
				particleUniforms[ "density" ].value = effectController.density;

			}

			initGUI() {

				var gui = new GUI( { width: 300 } );

				var folder1 = gui.addFolder( 'Dynamic parameters' );

				folder1.add( effectController, "gravityConstant", 0.0, 1000.0, 0.05 ).onChange( dynamicValuesChanger );
				folder1.add( effectController, "density", 0.0, 10.0, 0.001 ).onChange( dynamicValuesChanger );

				var folder2 = gui.addFolder( 'Static parameters' );

				folder2.add( effectController, "radius", 10.0, 1000.0, 1.0 );
				folder2.add( effectController, "height", 0.0, 50.0, 0.01 );
				folder2.add( effectController, "exponent", 0.0, 2.0, 0.001 );
				folder2.add( effectController, "maxMass", 1.0, 50.0, 0.1 );
				folder2.add( effectController, "velocity", 0.0, 150.0, 0.1 );
				folder2.add( effectController, "velocityExponent", 0.0, 1.0, 0.01 );
				folder2.add( effectController, "randVelocity", 0.0, 50.0, 0.1 );

				var buttonRestart = {
					restartSimulation: function () {

						restartSimulation();

					}
				};

				folder2.add( buttonRestart, 'restartSimulation' );

				folder1.open();
				folder2.open();

			}

			getCameraConstant( camera ) {

				return window.innerHeight / ( Math.tan( THREE.MathUtils.DEG2RAD * 0.5 * camera.fov ) / camera.zoom );

			}


			update() {
            // animate(){

                // requestAnimationFrame( animate );
                requestAnimationFrame( update );

				render();
				stats.update();

			}

			render() {

				gpuCompute.compute();

				particleUniforms[ "texturePosition" ].value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
				particleUniforms[ "textureVelocity" ].value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;

				renderer.render( scene, camera );

            }

        }
