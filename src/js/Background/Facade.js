/**
 * Class Background.Facade
 *
 * Decorative background with WebGL
 */

import { ICommonFacadeModuleObject } from "../Utils/Interfaces";
import { isVR } from "../Utils/Helper";

import App from "./App";
import {Scene} from "./scene/scene"

const Facade =
{
	...ICommonFacadeModuleObject,
	props: {
		instance: null
	},
	init()
	{
		this.props.instance = new App(new Scene());

	
			this.addEvent();
	

		return this;
	},
	setup()
	{
		// this.props.instance.setup();
	},
	update()
	{
		// if(this.props.instance.scene.scene0.scene2.objectSet.loadBool == true){
		// 	console.log(this.props.instance.loadBool);

			this.props.instance.update();
		// }
	},
	draw()
	{
		this.props.instance.draw();
	},
	destroy()
	{
	},
	onResize() { 
		this.props.instance.onResize(); 
	},
	// onMouseMove(e) { this.props.instance.onMouseMove(e); },
	
	onKeyUp(e)
	{
		this.props.instance.onKeyUp(e);
	},
	addEvent()
	{
		this.props.instance.addEvent(); 
	}

};

export default Facade;