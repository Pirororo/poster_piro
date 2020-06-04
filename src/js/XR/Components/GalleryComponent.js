import "aframe-html-shader";
import Gallery from "../Gallery/App_xr";
import { COMPONENTS } from "./../../Utils/Props";

const AFRAME = window.AFRAME;

export default AFRAME.registerComponent(COMPONENTS.Gallery,
{
 props: {},
 modules: {},
 init()
 {
		console.log("Gallery Component Init.");

		this.props.scene = this.el.object3D;
		this.props.container = this.el.appendChild(document.createElement("a-entity"));

		this.modules.gallery = Gallery;
		this.modules.gallery.init(this.props.container);
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