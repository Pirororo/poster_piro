import { COMPONENTS } from "../../Utils/Props";

const AFRAME = window.AFRAME;

export default AFRAME.registerComponent(COMPONENTS.RaycastCheck,
{
	// dependencies: ['raycaster'],
	props: {},
	init: function()
	{
		this.el.addEventListener('raycaster-intersection', function (e)
		{
			const targets = e.detail.intersections;
			if (targets.length > 0)
			{
				targets[0].object.material.color.set(0xffffff);
			}
		});

		this.el.addEventListener('raycaster-intersection-cleared', function (e)
		{
			const targets = e.detail.clearedEls;
			for ( var i = 0; i < targets.length; i++ ) {
				const obj = targets[i].object3DMap;
				if ("mesh" in obj)
				{
					obj.mesh.material.color.set(0x222222);
				}
			}
		});
	}
});