import { COMPONENTS, BOARD_ID } from "../../Utils/Props";
import { EVENT, Action } from "./../../Utils/EventManager";
import { SYNTH } from "./../../Utils/Sound";

const AFRAME = window.AFRAME;

export default AFRAME.registerComponent(COMPONENTS.RaycastTarget,
{
	init()
	{
		this.el.addEventListener("click", e =>
		{
			SYNTH.btnSound();
			// this.el.object3DMap.mesh.material.color.set(0xff0000);
			switch (this.el.instance.boardId)
			{
				case BOARD_ID.Entrance:
					Action.dispatch(EVENT.ShowCategory, { mode: "VR" });
					Action.dispatch(EVENT.VRModeStart);
					break;
				case BOARD_ID.Poster:
					Action.dispatch(EVENT.ShowDetail, {
						slug: this.el.instance.slug,
					});
					break;

				case BOARD_ID.Category:
					Action.dispatch(EVENT.ShowPoster, this.el.instance.category);
					break;

				case BOARD_ID.UI.BackToCategory:
					Action.dispatch(EVENT.BackToCategory, {
						mode: "VR"
					});
					break;
				case BOARD_ID.UI.BackToPoster:
					Action.dispatch(EVENT.BackToPoster);
					break;

				case BOARD_ID.UI.VRModeStart:
					Action.dispatch(EVENT.VRModeStart);
					break;
				case BOARD_ID.UI.ShowCategoryA:
					Action.dispatch(EVENT.ShowCategoryA);
					break;
				case BOARD_ID.UI.ShowCategoryD:
					Action.dispatch(EVENT.ShowCategoryD);
					break;
				case BOARD_ID.UI.ShowCategoryG:
					Action.dispatch(EVENT.ShowCategoryG);
					break;
				default:
					break;
			}

		});
	}
});
