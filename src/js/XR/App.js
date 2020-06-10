/**
 * Class XR.App
 *
 * Mainclass of XR App
 */

import { ICommonFacadeModuleObject } from "../Utils/Interfaces";
import { COMPONENTS, SELECTORS, UA } from "./../Utils/Props";
import { EVENT, Action } from "./../Utils/EventManager";
import { isVR, setVRMode } from "./../Utils/Helper";

import BackgroundComponent from "./Components/BackgroundComponent";
import EntranceComponent from "./Components/EntranceComponent";
import GalleryComponent from "./Components/GalleryComponent";
import DetailComponent from "./Components/DetailComponent";
import RaycastCheckComponent from "./Components/RaycastCheckComponent";
import RaycastTargetComponent from "./Components/RaycastTargetComponent";
import raycastCursorListener from "./Components/RaycastCursorListenerComponent";

import XR_Scaffold from "./../../xr_scaffold.html";

const App =
{
	...ICommonFacadeModuleObject,
	props: {},
	elements: {},
	components: {},
	init()
	{
		console.log("XR App Init. " + isVR());

		this.components.background = BackgroundComponent;
		this.components.entrance = EntranceComponent;
		this.components.gallery = GalleryComponent;
		this.components.detail = DetailComponent;
		this.components.raycastCheck = RaycastCheckComponent;
		this.components.raycastTarget = RaycastTargetComponent;
		this.components.raycastCursorListener = raycastCursorListener;

		this.elements.body = document.body;
		this.elements.contentContainer = document.getElementById(SELECTORS.ContentContainer);

		this.addEvent();

		// For debug. if accessing xr.html then isVR() is true. And immediately invoke contents for VR
		if (isVR()) { this.setup(); }

		return this;
	},

	setup()
	{
		setVRMode(true);
		Action.dispatch(EVENT.ShowVREnterace);

		document.body.setAttribute("id", SELECTORS.ContentContainerXR);

		this.elements.scene = document.getElementById(SELECTORS.XRScene);
		// this.attachComponent(this.elements.scene, "vr-mode-ui", "enabled: false");
		this.elements.scene.addEventListener("exit-vr", () => {
			location.href = "/session/";
		});

		this.attachComponent(this.elements.scene, COMPONENTS.Entrance);
		// this.setupMainComponents();

		this.elements.xr_player = this.attachComponent(document.getElementById(SELECTORS.XRPlayer), COMPONENTS.RaycastCheck);
		this.elements.xr_raycaster = document.getElementById(SELECTORS.Raycaster);
		this.attachComponent(this.elements.xr_raycaster, "raycaster", `objects: .${SELECTORS.RaycastTarget}`);
		this.attachComponent(this.elements.xr_raycaster, "cursor", `fuse: ${UA.isAndroidChrome() ? true : false }; fuse-timeout: 1000`);
		this.attachComponent(this.elements.xr_raycaster, COMPONENTS.RaycastCursorListener);

	},

	setupMainComponents()
	{
		this.attachComponent(this.elements.scene, COMPONENTS.Background);
		this.attachComponent(this.elements.scene, COMPONENTS.Gallery);
		this.attachComponent(this.elements.scene, COMPONENTS.Detail);
	},

	attachComponent(element, key, value = "")
	{
		if (element != null)
		{
			return element.setAttribute(key, value);
		}
		return null;
	},

	addEvent()
	{
		Action.add(EVENT.VRModeSelected, () => {
			if (this.elements.scene == null)
			{
				this.elements.body.insertAdjacentHTML("beforeend", XR_Scaffold);
				this.setup();
			}

			setTimeout(() => {
				this.elements.scene.enterVR();
				document.getElementById(SELECTORS.BackgroundStage).innerHTML = "";
				document.getElementById(SELECTORS.StartupStage).innerHTML = "";
			}, 200);
		});

		Action.add(EVENT.ShowCategory, data => {
			if (data.mode == "VR")
			{
				this.setupMainComponents();
			}
		});


		// setTimeout(() => {
		// 	Action.dispatch(EVENT.ShowStartup);
		// }, 100);

		// setTimeout(() => {
		// 	Action.dispatch(EVENT.ShowDetail, { slug: "f03" });
		// }, 100);

	},

	onKeyUp(e)
	{
		if (this.components.background != null) {
			this.components.background.prototype.onKeyUp(e);
		}
		// this.components.gallery.prototype.onKeyUp(e);
	}

};

export default App;