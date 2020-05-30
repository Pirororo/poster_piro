/**
 * Class XR.Facade
 *
 * Facade class of XR helpers
 */

import { ICommonFacadeModuleObject } from "../Utils/Interfaces";
import App from "./App";

const Facade =
{
	...ICommonFacadeModuleObject,
	props: {
		instance: null
	},
	init()
	{
		this.props.instance = App;
		return this;
  },
	setup()
	{
		this.props.instance.setup();
  },
	update()
	{
		// this.props.instance.update();
  },
	draw()
	{
		// this.props.instance.draw();
	},
	destroy()
	{
	},
	onResize() { this.props.instance.onResize(); },
	onMouseMove(e) { this.props.instance.onMouseMove(e); },
	onKeyUp(e) { this.props.instance.onKeyUp(e); }
};

export default Facade;