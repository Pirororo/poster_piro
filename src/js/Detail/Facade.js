/**
 * Class Detail.Facade
 *
 * Facade class of Detail app
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
		this.props.instance =  new App;
		this.addEvent();
		return this;
  },
	draw()
	{
		this.props.instance.draw();
  },
  onClick(e) {
		this.props.instance.onClick(e);
	},
  onResize() { this.props.instance.onResize();
  },

  onKeyUp(e) { this.props.instance.onKeyUp(e);
  },
  addEvent() {
		this.props.instance.addEvent();
	}

};

export default Facade;