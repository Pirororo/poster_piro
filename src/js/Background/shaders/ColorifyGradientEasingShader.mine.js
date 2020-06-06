/**
 * @author Hiroko K
 *
 * Colorify shader
 */	
import {
	Color
} from "three/build/three";
// } from "three";
// } from "three.module.js";
// } from "../../../build/three.module.js";
// import {
// 	Uniform
// } from '../../../src/Three';

var ColorifyGradientEasingShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"color":    { value: new Color( 0xff0000 ) },
		"color2":    { value: new Color( 0xff0000 ) },
		"targetColor":    { value: new Color( 0xff0000 ) },
		"targetColor2":    { value: new Color( 0xff0000 ) },
		"time": {value: 0.0},
		"duration": {value: 0.0}

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform vec3 color;",
		"uniform vec3 color2;",
		"uniform vec3 targetColor;",
		"uniform vec3 targetColor2;",
		"uniform float time;",
		"uniform float duration;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",

			"vec3 luma = vec3( 0.299, 0.587, 0.114 );",
			"float v = dot( texel.xyz, luma );",

			"float deltaTime = time/duration;",
			"vec3 distColor = targetColor - color;",
			"vec3 nowColor = distColor * deltaTime * deltaTime + color; ",
			"vec3 distColor2 = targetColor2 - color2;",
			"vec3 nowColor2 = distColor2 * deltaTime * deltaTime + color2; ",


			// "vec3 nowColor2 = color2 + (targetColor2 - color2) *0.02;",//徐々に色変化

			"vec3 gradate = nowColor * vUv.y + nowColor2 * (1.0 - vUv.y);",

			// "gl_FragColor = vec4( v * color, texel.w );",
			"gl_FragColor = vec4(v * gradate, texel.w );",

		"}"

	].join( "\n" )

};

export { ColorifyGradientShader };


////waterReflectionshaderより

// import {
// 	Uniform
// } from '../../../src/Three';

// export const WaterRefractionShader: {
// 	uniforms: {
// 		color: Uniform;
// 		time: Uniform;
// 		tDiffuse: Uniform;
// 		tDudv: Uniform;
// 		textureMatrix: Uniform;
// 	};
// 	vertexShader: string;
// 	fragmentShader: string;
// };
