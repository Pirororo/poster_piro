import Detail from "../../Detail/App_xr";
import { COMPONENTS } from "./../../Utils/Props";

const AFRAME = window.AFRAME;

export default AFRAME.registerComponent(COMPONENTS.Detail,
{
	props: {},
	modules: {},
	init()
	{
		console.log("Detail Component Init.");
		this.props.scene = this.el.object3D;
		this.props.container = this.el.appendChild(document.createElement("a-entity"));

		this.modules.detail = Detail;
		this.modules.detail.init(this.props.container.object3D);

		this.props.scene.add(this.props.container.object3D);
	},
	tick()
	{
		this.modules.detail.draw();
	}
});
