import { COMPONENTS, COLOR } from "../../Utils/Props";

const AFRAME = window.AFRAME;

export default AFRAME.registerComponent(COMPONENTS.RaycastCheck,
{
	// dependencies: ['raycaster'],
	props: {},
	init: function()
	{
		this.el.addEventListener('raycaster-intersection', e =>
		{
			const targets = e.detail.intersections;
			if (targets.length > 0)
			{
				// console.dir(targets[0]);
				targets[0].object.el.instance.onRaycastForcedOn(this.el);
				targets[0].object.material.color.set(COLOR.RaycastFocusOn);
			}
		});

		this.el.addEventListener('raycaster-intersection-cleared', e =>
		{
			const targets = e.detail.clearedEls;
			for ( var i = 0; i < targets.length; i++ ) {
				const obj = targets[i].object3DMap;
				if ("mesh" in obj)
				{
					obj.mesh.el.instance.onRaycastForcedOff(this.el);
					obj.mesh.material.color.set(COLOR.RaycastFocusOff);
				}
			}
		});
	}
});