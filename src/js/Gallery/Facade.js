/**
 * Class Gallery.Facade
 *
 * Facade class of Gallery app
 */

import { ICommonFacadeModuleObject } from "../Utils/Interfaces";
import { EVENT, Action } from "./../Utils/EventManager";

import App from "./App";

const Facade =
{
	...ICommonFacadeModuleObject,
	props: {
		instance: null
	},
	init()
	{
		this.props.instance = new App();
		this.addEvent();

		return this;
	},

	draw()
	{
		this.props.instance.draw();
	},

	onResize() {
		this.props.instance.onResize();
	},
	onClick(e) {
		this.props.instance.onClick(e);
	},
	onMouseMove(e) {
		this.props.instance.onMouseMove(e);
	},
	// onKeyUp(e) {
	// 	this.props.instance.onKeyUp(e);
	// },
	addEvent() {
		this.props.instance.addEvent();
	}
};

export default Facade;