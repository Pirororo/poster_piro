import "aframe-html-shader";
import Gallery from "../../Gallery/App_xr";
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

		setTimeout(() => {
			this.modules.gallery = new Gallery();
			this.modules.gallery.init(this.props.container);
			console.dir(this.props.container);
		}, 1000);

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
		console.log(e.keyCode);
	}
});