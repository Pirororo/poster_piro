import { EVENT, COMPONENTS, BOARD_ID } from "../../Utils/Props";

const AFRAME = window.AFRAME;

export default AFRAME.registerComponent(COMPONENTS.RaycastTarget,
{
	init()
	{
		this.el.addEventListener("click", e =>
		{
			// console.dir(this.el.instance);
			this.el.object3DMap.mesh.material.color.set(0xff0000);
			switch (this.el.instance.boardId)
			{
				case BOARD_ID.Poster:
					document.dispatchEvent(new CustomEvent(EVENT.ShowDetail, {
						detail: {
							data: {
								category: this.el.instance.category,
								index: this.el.instance.index
							}
						}
					}));
					break;
				case BOARD_ID.Category:
					document.dispatchEvent(new CustomEvent(EVENT.ShowPoster, {
						detail: {
							data: this.el.instance.category
						}
					}));
					break;
				case BOARD_ID.UI.BackToCategory:
					document.dispatchEvent(new CustomEvent(EVENT.BackToCategory));
					break;
				case BOARD_ID.UI.BackToPoster:
					document.dispatchEvent(new CustomEvent(EVENT.BackToPoster));
					break;
				case BOARD_ID.UI.VRModeStart:
					document.dispatchEvent(new CustomEvent(EVENT.VRModeStart));
					break;

				case BOARD_ID.UI.ShowCategoryA:
					document.dispatchEvent(new CustomEvent(EVENT.ShowCategoryA));
					break;
				case BOARD_ID.UI.ShowCategoryD:
					document.dispatchEvent(new CustomEvent(EVENT.ShowCategoryD));
					break;
				case BOARD_ID.UI.ShowCategoryG:
					document.dispatchEvent(new CustomEvent(EVENT.ShowCategoryG));
					break;
				default:
					break;
			}

		});
	}
});
