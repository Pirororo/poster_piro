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
		// this.props.instance.init();

		this.addEvent();

		return this;
  },
	setup()
	{
		// Because App class calls setup() from init()
		// this.props.instance.setup();
  },
	update()
	{

		// Because App class doesn't have update ()
		// this.props.instance.update();
  },
	draw()
	{
		// this.props.instance.draw();
	},
	destroy()
	{
	},
	addEvent()
	{
		Action.add(EVENT.ShowCategory, () => {
			this.props.instance.init();
		});
	}
	// onResize() { this.props.instance.onResize(); },
	// onMouseMove(e) { this.props.instance.onMouseMove(e); },
	// onKeyUp(e) { this.props.instance.onKeyUp(e); }
	// onClick(e) { this.props.instance.onClick(e); }
};

export default Facade;