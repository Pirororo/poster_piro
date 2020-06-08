import { EVENT, Action } from "./../../Utils/EventManager";
import { SELECTORS, BOARD_ID } from "./../../Utils/Props";
import XRModuleBase from "../Common/XRModuleBase";
import EntranceBoard_xr from "./EntranceBoard_xr";

export default
{
  ...XRModuleBase,
  init(scene)
  {
    this.init_base(scene);
    this.containers =
    {
      ...this.containers,
      entrance: {}
    };

    this.addEvent();
  },

  generateContent()
  {
    this.containers.entrance.board = this.generateContainer(SELECTORS.XREntranceBoardContainer, this.scene);
    this.boardList.length = 0;
    this.hudUIList.length = 0;

    const contents = [];
    const boardContent = document.getElementById(SELECTORS.GalleryStage);

    contents.push({
      summary: {}
    });

    const amount = contents.length;
    for (let i = 0; i < amount; i++)
    {
      const parameter =
      {
        index: i,
        name: `entrance_${i}`,
        boardId: BOARD_ID.Entrance,
        containers: {
          board: this.containers.entrance.board,
          boardContent
        },
        data: contents[i]
      };
      this.boardList.push(new EntranceBoard_xr(parameter));
    }

    this.showBoard(54, this.boardList, 18);
    // this.generateHUD(BOARD_ID.UI.BackToPoster, [0, 15, -20]);
  },

  addEvent()
  {
    Action.add(EVENT.VRModeSelected, () => {
      this.generateContent();
    });

    Action.add(EVENT.ShowCategory, () => {

    });

    setTimeout(() => {
      this.generateContent();
    }, 200);
  }
}
