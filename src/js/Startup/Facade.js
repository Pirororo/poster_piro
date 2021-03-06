/**
 * Class Startup.Facade
 *
 * Facade class of Gallery app
 */

import { ICommonFacadeModuleObject } from "../Utils/Interfaces";
import App from "./App";
import "./../../css/style.scss";

const Facade =
{
	...ICommonFacadeModuleObject,
	props: {
		instance: null
	},
	init()
	{
		this.props.instance = App;
		this.props.instance.init();

		this.addEvent();

		return this;
	},
	addEvent()
	{
		this.props.instance.addEvent();
	}
};

export default Facade;