import Background from "../../Background/App_xr";
import { Scene as Background_Scene } from "../../Background/scene/scene_xr";
import { SELECTORS, COMPONENTS } from "./../../Utils/Props";

const AFRAME = window.AFRAME;

export default AFRAME.registerComponent(COMPONENTS.Background,
{
	props: {},
	modules: {},
	init()
	{
		console.log("Background Component Init.");

		this.props.scene = this.el.object3D;

		const container = document.createElement("a-entity");
		container.setAttribute("id", SELECTORS.BackgroundContainer);
		this.props.container = this.el.appendChild(container);

		this.modules.scene = new Background_Scene();
		this.modules.scene.setup();
		// this.modules.app = new Background(this.modules.scene);

		// attach each scenes to AFrame root scene
		setTimeout(() => {
			this.props.container.object3D.add(this.modules.scene);
		}, 1000);
	},

	tick()
	{
		this.modules.scene.update();
	},

	onKeyUp(e)
	{
		if (this.modules.scene != null)
		{
			this.modules.scene.onKeyUp(e);
		}
	}
});