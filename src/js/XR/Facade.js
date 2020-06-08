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
		this.props.instance = App.init();

		return this;
  },
	onResize() { this.props.instance.onResize(); },
	onMouseMove(e) { this.props.instance.onMouseMove(e); },
	onKeyUp(e) { this.props.instance.onKeyUp(e); }
};

export default Facade;