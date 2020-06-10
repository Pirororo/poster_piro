import { COMPONENTS } from "../../Utils/Props";

const AFRAME = window.AFRAME;

export default AFRAME.registerComponent(COMPONENTS.RaycastCursorListener,
{
	// dependencies: ['raycaster'],
	props: {},
	init()
	{
		let fuseMode = this.el.getAttribute("cursor").fuse;
		let fusing = false;

		// console.log("Fuse Mode: " + this.el.getAttribute("cursor").fuse);

		this.el.addEventListener("click", function(e)
		{
			// console.log("click");
			if (!fuseMode) {
				e.target.firstElementChild.emit("doClick");
			}
		});

		this.el.addEventListener("fusing", function(e)
		{
			// console.dir(e);
			fusing = e.detail.intersection != null;

			if (fusing)
			{
				// console.dir("fusing");
				e.target.firstElementChild.emit("doFusing");
			}
			else
			{
				// console.dir("not fusing");
				e.target.firstElementChild.emit("notFusing");
			}
		});

		this.el.addEventListener("mouseleave", function(e) {
			// console.dir("mouseleave");
			if (fuseMode) {
				e.target.firstElementChild.emit("notFusing");
			}
    });
	}
});