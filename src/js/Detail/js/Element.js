import { CSS3DObject } from "./CSS3DRenderer";

export default class Element
{
	constructor( url, x, y, z, ry )
	{

		var div = document.createElement( 'div' );
		div.style.width = '800px';
		div.style.height = '450px';

		var iframe = document.createElement( 'iframe' );
		iframe.style.width = '800px';
		iframe.style.height = '450px';
		iframe.style.border = '0px';
		iframe.src = url;

		div.appendChild( iframe );

		var object = new CSS3DObject( div );
		object.position.set( x, y, z );
		object.rotation.y = ry;

		return object;
	}
}