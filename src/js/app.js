/**
 * Class App
 *
 * Starting point of whole app
 */
import "./../css/style.scss";
import ObjectExtenstions from "./Utils/ObjectExtensions";
import { setDebugMode } from "./Utils/Helper";
import Composer from "./Composer";

// Define namespace
const OpenHouse2020 = {};
OpenHouse2020.PosterSession = OpenHouse2020.PosterSession || {};

// Define App class
OpenHouse2020.PosterSession.App =
{
	delegator: null,
	init() {
		this.addExtensions();
		this.delegator = Composer.init();

		this.addEvent();
	},
	onResize() { this.delegator.onResize(); },
	onMouseMove(e) { this.delegator.onMouseMove(e); },
	onKeyUp(e) { this.delegator.onKeyUp(e); },
	onClick(e) { this.delegator.onClick(e); },
	onTouchStart(e) { this.delegator.onTouchStart(e); },
	addEvent() {
		window.addEventListener("resize", () => this.onResize());
		window.addEventListener("mousemove", e => this.onMouseMove(e));
		window.addEventListener("keyup", e => this.onKeyUp(e));
		document.addEventListener("click", e => this.onClick(e), false);
		document.body.addEventListener("touchstart", e => this.onTouchStart(e), false);
	},
	addExtensions() {
		ObjectExtenstions.init();
	},
};



// Launch app when DOM will be ready
window.addEventListener("DOMContentLoaded", () => {
	// window.console.info = () => { };
	// window.console.log = () => { };
	// window.console.dir = () => { };

	const isDebugMode = document.getElementsByTagName("a-scene").length > 0;
	setDebugMode(isDebugMode);
	console.log(`DebugMode: ${isDebugMode}`);

	OpenHouse2020.PosterSession.App.init();
});

