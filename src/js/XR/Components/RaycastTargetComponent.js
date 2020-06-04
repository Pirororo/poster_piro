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
				default:
					break;
			}

		});
	}
});
