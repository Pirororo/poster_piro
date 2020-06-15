/**
 * Class Gallery.Facade
 *
 * Facade class of Gallery app
 */

import { ICommonFacadeModuleObject } from "../Utils/Interfaces";
import { EVENT, Action } from "./../Utils/EventManager";
import { isVR } from "./../Utils/Helper";

import App from "./App";

const Facade =
{
	...ICommonFacadeModuleObject,
	props: {
		instance: null,
		isEnabled: false
	},
	init()
	{
		this.props.instance = new App();
		this.addEvent();

		return this;
	},

	draw()
	{
		if (!this.props.isEnabled) { return; }
		this.props.instance.draw();
	},

	onResize() {
		if (!this.props.isEnabled) { return; }
		this.props.instance.onResize();
	},
	onClick(e) {
		if (!this.props.isEnabled) { return; }
		this.props.instance.onClick(e);
	},
	onMouseMove(e) {
		if (!this.props.isEnabled) { return; }
		this.props.instance.onMouseMove(e);
	},
	onTouchStart(e) {
		if (!this.props.isEnabled) { return; }
		this.props.instance.onTouchStart(e);
	},
	addEvent()
	{
		this.props.instance.addEvent();

		Action.add(EVENT.ShowCategory, data =>{
			if (data.mode == "normal" && !("category" in data) && !isVR())
			{
				this.props.isEnabled = true;
      }
    });
	}
};

export default Facade;