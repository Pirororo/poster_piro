import "aframe-html-shader";
import Gallery from "../Gallery/App_xr";
import { COMPONENTS, SELECTORS } from "./../../Utils/Props";
import { show, isDebugMode } from "./../../Utils/Helper";

const AFRAME = window.AFRAME;

export default AFRAME.registerComponent(COMPONENTS.Gallery,
{
 props: {},
 modules: {},
 elements: {},
 init()
 {
		console.log("Gallery Component Init.");

		this.props.scene = this.el.object3D;
		this.props.container = this.el.appendChild(document.createElement("a-entity"));

		this.elements.container = document.getElementById(SELECTORS.GalleryContainer);
		this.elements.container.classList.add("show");

		this.modules.gallery = Gallery;
		this.modules.gallery.init(this.props.container);
		show(SELECTORS.GalleryContainer);

		// Don't call setup() if under Debug Mode
		if (!isDebugMode()) { this.modules.gallery.setup(); }
	},

	tick()
	{
		if  (this.modules.gallery == null)
		{
			return;
		}
		this.modules.gallery.draw();
	},

	onKeyUp(e)
	{
	}
});