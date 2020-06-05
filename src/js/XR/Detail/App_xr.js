import { BOARD_ID, EVENT, SELECTORS } from "../../Utils/Props";
import { loadJSON } from "../../Utils/AssetsLoader";

import XRModuleBase from "../Common/XRModuleBase";
import DetailBoard_xr from "./DetailBoard_xr";

export default
{
  ...XRModuleBase,
  init(scene)
  {
    this.init_base(scene);
    this.containers =
    {
      ...this.containers,
      detail: {}
    };
    this.addEvent();

    // The code below is temporary for test.
    // Will be replaced request json with REST API after soon.
    loadJSON("./../data/entry_dummy.json", e => {
      const result = JSON.parse(e.result);
      if (Array.isArray(result) && result.length > 0)
      {
        this.entry = result[0];
        console.log("Entry json has been loaded.");
      }
    });
  },
  generateContent(postid = 1)
  {
    this.containers.detail.board = this.generateContainer(SELECTORS.XRDetailContainer, this.scene);
    this.boardList.length = 0;
    this.hudUIList.length = 0;

    const boardContent = document.getElementById(SELECTORS.DetailStage);
    const data = this.entry;
    const amount = 5;
    for (let i = 0; i < amount; i++)
    {
      const parameter =
      {
        index: i,
        name: `detail${data.id}_${i}`,
        // category: data.categories[0],
        boardId: BOARD_ID.Detail,
        containers: {
          board: this.containers.detail.board,
          boardContent
        },
        data
      };
      this.boardList.push(new DetailBoard_xr(parameter));
    }
    this.showBoard(48, this.boardList, 18);
    this.generateHUD(BOARD_ID.UI.BackToPoster, [0, 15, -20]);
  },

  addEvent()
  {
    document.addEventListener(EVENT.ShowDetail, e => {

      const entry = e.detail;
      console.log(`Show detail: Entry ${entry}`);
      this.generateContent();
    });
    document.addEventListener(EVENT.BackToPoster, e => {

      console.log("Go back Posters");
      this.destroy();
    });
  }
}
