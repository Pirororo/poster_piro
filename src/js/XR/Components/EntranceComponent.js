import "aframe-html-shader";
import Entrance from "../Entrance/App_xr";
import { SELECTORS, COMPONENTS } from "./../../Utils/Props";

const AFRAME = window.AFRAME;

export default AFRAME.registerComponent(COMPONENTS.Entrance,
{
 props: {},
 modules: {},
 elements: {},
 init()
 {
		console.log("Entrance Component Init.");

		this.props.scene = this.el.object3D;
		this.props.container = this.el.appendChild(document.createElement("a-entity"));
		this.props.container.setAttribute("id", "component_entrance");

		this.elements.container = document.getElementById(SELECTORS.EntranceContainer);
		this.elements.container.classList.add("show");

		this.modules.entrance = Entrance;
		this.modules.entrance.init(this.props.container);
	},

	tick()
	{
		this.modules.entrance.draw();
	}
});