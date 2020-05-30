/**
 * Class App
 *
 * Starting point of whole app
 */
import "./../css/style.scss";
import ObjectExtenstions from "./Utils/ObjectExtensions";
import { isVR, setVRMode } from "./Utils/Helper";
import Composer from "./Composer";

// Define namespace
const OpenHouse2020 = OpenHouse2020 || {};
OpenHouse2020.PosterSession = OpenHouse2020.PosterSession || {};

// Define App class
OpenHouse2020.PosterSession.App =
{
	delegator: null,
	init()
	{
		this.addExtensions();
		this.delegator = Composer.init();

		this.addEvent();
	},
	onResize() { this.delegator.onResize(); },
	onMouseMove(e) { this.delegator.onMouseMove(e); },
	onKeyUp(e) { this.delegator.onKeyUp(e); },
	onClick(e) { this.delegator.onClick(e); },

	addEvent()
	{
		window.addEventListener("resize", () => this.onResize());
		window.addEventListener("mousemove", e => this.onMouseMove(e));
		window.addEventListener("keyup", e => this.onKeyUp(e));
		document.addEventListener("click", e => this.onClick(e));
	},
	addExtensions()
	{
		ObjectExtenstions.init();
	}
};

// Launch app when DOM will be ready
window.addEventListener("DOMContentLoaded", () =>
{
	const isVRMode = document.getElementsByTagName("a-scene").length > 0;

	setVRMode(isVRMode);
	console.log(`VRMode: ${isVR()}`);

  OpenHouse2020.PosterSession.App.init();
});

