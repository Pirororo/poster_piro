/**
 * Class Composer
 *
 * Assembling each module instances.
 */

import Background from "./Background/Facade"; // will be created by Piro
import Gallery from "./Gallery/Facade"; // will be created by Yonekura
import Detail from "./Detail/Facade"; // will be created by Shinagawa
import XRHelper from "./XR/Facade"; // will be created by Beharu

import Router from "./Utils/Router";
import { isVR } from "./Utils/Helper";

const Composer =
{
	props: {
		isPause: false,
	},
	instances: {},
	init() {

		// Router.init();

		if (isVR()) {
			this.instances.xr = XRHelper.init();
		}
		else {
			this.instances.background = Background.init();
			this.instances.gallery = Gallery.init();
			// this.instances.detail = Detail.init();
		}

		this.addEvent();
		this.setup();

		return this;
	},
	setup(options = {}) {
		this.instances.forIn((k, instance) => instance.setup());
		this.update();
	},
	update() {
		this.instances.forIn((k, instance) => instance.update());

		window.requestAnimationFrame(() => {
			if (!this.props.isPause) {
				this.update();
			}
		});

		this.draw();
	},
	draw() {
		this.instances.forIn((k, instance) => instance.draw());
	},
	destroy() {
	},
	pause() {
		this.props.isPause = true;
	},
	resume() {
		this.props.isPause = false;
	},

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

	addEvent(events) {

	}
};

export default Composer;
