
		// <!-- Fragment shader for protoplanet's position -->
		<script id="computeShaderPosition" type="x-shader/x-fragment">

			#define delta ( 1.0 / 60.0 )

			void main() {

				vec2 uv = gl_FragCoord.xy / resolution.xy;

				vec4 tmpPos = texture2D( texturePosition, uv );
				vec3 pos = tmpPos.xyz;

				vec4 tmpVel = texture2D( textureVelocity, uv );
				vec3 vel = tmpVel.xyz;
				float mass = tmpVel.w;

				if ( mass == 0.0 ) {
					vel = vec3( 0.0 );
				}

				// Dynamics
				pos += vel * delta;

				gl_FragColor = vec4( pos, 1.0 );

			}

        </script>



		// <!-- Particles vertex shader -->
		<script type="x-shader/x-vertex" id="particleVertexShader">

			// For PI declaration:
			#include <common>

			uniform sampler2D texturePosition;
			uniform sampler2D textureVelocity;

			uniform float cameraConstant;
			uniform float density;

			varying vec4 vColor;

			float radiusFromMass( float mass ) {
				// Calculate radius of a sphere from mass and density
				return pow( ( 3.0 / ( 4.0 * PI ) ) * mass / density, 1.0 / 3.0 );
			}


			void main() {


				vec4 posTemp = texture2D( texturePosition, uv );
				vec3 pos = posTemp.xyz;

				vec4 velTemp = texture2D( textureVelocity, uv );
				vec3 vel = velTemp.xyz;
				float mass = velTemp.w;

				vColor = vec4( 1.0, mass / 250.0, 0.0, 1.0 );

				vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

				// Calculate radius of a sphere from mass and density
				//float radius = pow( ( 3.0 / ( 4.0 * PI ) ) * mass / density, 1.0 / 3.0 );
				float radius = radiusFromMass( mass );

				// Apparent size in pixels
				if ( mass == 0.0 ) {
					gl_PointSize = 0.0;
				}
				else {
					gl_PointSize = radius * cameraConstant / ( - mvPosition.z );
				}

				gl_Position = projectionMatrix * mvPosition;

			}

		</script>


		{/* //<!-- Particles fragment shader --> */}
		<script type="x-shader/x-fragment" id="particleFragmentShader">

			varying vec4 vColor;

			void main() {

				float f = length( gl_PointCoord - vec2( 0.5, 0.5 ) );
				if ( f > 0.5 ) {
					discard;
				}
				gl_FragColor = vColor;

			}

		</script>