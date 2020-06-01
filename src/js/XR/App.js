/**
 * Class XR.App
 *
 * Mainclass of XR App
 */

import { ICommonFacadeModuleObject } from "../Utils/Interfaces";
import { COMPONENTS, SELECTORS } from "./../Utils/Props";

import BackgroundComponent from "./Components/BackgroundComponent";
import GalleryComponent from "./Components/GalleryComponent";
import DetailComponent from "./Components/DetailComponent";
import RaycastCheckComponent from "./Components/RaycastCheckComponent";
import RaycastTargetComponent from "./Components/RaycastTargetComponent";

const App =
{
	...ICommonFacadeModuleObject,
	props: {
		elements: {}
	},
	components: {},
	init()
	{
		console.log("XR App Init.");

		this.components.background = BackgroundComponent;
		this.components.gallery = GalleryComponent;
		this.components.detail = DetailComponent;
		this.components.raycastCheck = RaycastCheckComponent;
		this.components.raycastTarget = RaycastTargetComponent;

		return this;
	},

	setup()
	{
		this.props.elements.scene = document.getElementById(SELECTORS.XRScene);
		this.attachComponent(this.props.elements.scene, COMPONENTS.Background);
		this.attachComponent(this.props.elements.scene, COMPONENTS.Gallery);

		this.props.elements.xr_player = this.attachComponent(document.getElementById(SELECTORS.XRPlayer), COMPONENTS.RaycastCheck);
		this.props.elements.xr_raycaster = document.getElementById(SELECTORS.Raycaster);
		this.attachComponent(this.props.elements.xr_raycaster, "raycaster", `objects: .${SELECTORS.RaycastTarget}`);
		this.attachComponent(this.props.elements.xr_raycaster, "cursor", `fuse: false`);

	},

	attachComponent(element, key, value = "")
	{
		if (element != null)
		{
			return element.setAttribute(key, value);
		}
		return null;
	},

	onKeyUp(e)
	{
		// this.components.background.prototype.onKeyUp(e);
		this.components.gallery.prototype.onKeyUp(e);
	}

};

export default App;