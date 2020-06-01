import Background from "../../Background/App_xr";
import { Scene as Background_Scene } from "../../Background/scene/scene_xr";
import { COMPONENTS } from "./../../Utils/Props";

const AFRAME = window.AFRAME;

export default AFRAME.registerComponent(COMPONENTS.Background,
{
	props: {},
	modules: {},
	init()
	{
		console.log("Background Component Init.");

		this.props.scene = this.el.object3D;
		this.props.container = this.el.appendChild(document.createElement("a-entity"));

		this.modules.scene = new Background_Scene();
		this.modules.scene.setup();
		this.modules.app = new Background(this.modules.scene);

		// attach each scenes to AFrame root scene
		this.props.container.object3D.add(this.modules.scene);
	},

	tick()
	{
		this.modules.app.update();
	},

	onClick(e)
	{
		console.log("click");
	}
});