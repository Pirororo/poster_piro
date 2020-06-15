/**
 * Class Detail.Facade
 *
 * Facade class of Detail app
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
		this.props.instance =  new App;
		this.addEvent();
		return this;
  },
	draw()
	{
		if (!this.props.isEnabled) { return; }
		this.props.instance.draw();
  },
  onClick(e) {
		if (!this.props.isEnabled) { return; }
		this.props.instance.onClick(e);
	},
  onResize() {
		if (!this.props.isEnabled) { return; }
		this.props.instance.onResize();
  },

  onKeyUp(e) {
		if (!this.props.isEnabled) { return; }
		this.props.instance.onKeyUp(e);
  },
  addEvent() {
		Action.add(EVENT.ShowCategory, data =>{
			if (data.mode == "normal" && !("category" in data) && !isVR())
			{
				this.props.isEnabled = true;
				this.props.instance.init();
      }
    });
	}
};

export default Facade;