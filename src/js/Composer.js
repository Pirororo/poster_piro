/**
 * Class Composer
 *
 * Assembling each module instances.
 */

import Background from "./Background/Facade"; // will be created by Piro
import Gallery from "./Gallery/Facade"; // will be created by Yonekura
import Detail from "./Detail/Facade"; // will be created by Shinagawa
import XR from "./XR/Facade"; // will be created by Beharu
import Startup from "./Startup/Facade";

// import Router from "./Utils/Router";
import { isVR, show } from "./Utils/Helper";
import { SELECTORS } from "./Utils/Props";
import { EVENT, Action } from "./Utils/EventManager";

const Composer =
{
	props: {},
	instances: {},
	elements: {},
	init()
	{
		// Router.init();
		this.instances.background = Background.init();
		this.instances.startup = Startup.init()
		this.instances.gallery = Gallery.init();
		this.instances.detail = Detail.init();
		this.instances.xr = XR.init();

		show(SELECTORS.BackgroundContainer);

		this.addEvent();
		this.setup();

		return this;
	},
	setup() {
		// this.instances.forIn((k, instance) => instance.setup());
		this.update();
	},
	update() {
		this.instances.forIn((k, instance) => instance.update());
		window.requestAnimationFrame(() => this.update());
		this.draw();
	},
	draw() {
		this.instances.forIn((k, instance) => instance.draw());
	},
	destroy() {},
	onResize() {
		this.instances.forIn((k, instance) => instance.onResize());
	},
	onMouseMove(e) {
		this.instances.forIn((k, instance) => instance.onMouseMove(e));
	},
	onKeyUp(e) {
		this.instances.forIn((k, instance) => instance.onKeyUp(e));
	},
	onClick(e) {
		this.instances.forIn((k, instance) => instance.onClick(e));
	},

	addEvent()
	{
		// Dispath Events for Debug

		// setTimeout(() => {
		// 	// Action.dispatch(EVENT.SkipOpening);
		// 	Action.dispatch(EVENT.ShowStartup);
		// }, 100);

		// setTimeout(() => {
		// 	Action.dispatch(EVENT.ShowCategory, "initial");
		// }, 500);
	}
};

export default Composer;
