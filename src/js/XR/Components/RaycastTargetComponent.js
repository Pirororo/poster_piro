import { EVENT, COMPONENTS } from "../../Utils/Props";

const AFRAME = window.AFRAME;

export default AFRAME.registerComponent(COMPONENTS.RaycastTarget,
{
	init()
	{
		this.el.addEventListener("click", e =>
		{
			// console.dir(this.el.instance);
			this.el.object3DMap.mesh.material.color.set(0xff0000);
			document.dispatchEvent(new CustomEvent(EVENT.ShowDetail, {
				detail: {
					category: 1,
					index: this.el.instance.index
				}
			}));
		});
	}
});
