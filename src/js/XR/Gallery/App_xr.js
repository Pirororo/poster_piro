import { posterData } from "../../Gallery/posterData";
import { BOARD_ID, SELECTORS } from "../../Utils/Props";
import { invoke } from "./../../Utils/Helper";
import { EVENT, Action } from "./../../Utils/EventManager"

import XRModuleBase from "../Common/XRModuleBase";
import PosterBoard_xr from "./PosterBoard_xr";
import CategoryBoard_xr from "./CategoryBoard_xr";

export default
{
  ...XRModuleBase,
  init(scene)
  {
    this.init_base(scene);
    this.containers =
    {
      ...this.containers,
      category: {
        board: null
      },
      poster: {
        panel: null,
        title: null
      }
    };
    this.currentCategory = "";
    this.addEvent();
    this.generateCategory(posterData);
  },

  generatePosters(category = this.currentCategory)
  {
    this.currentCategory = category;
    this.containers.poster.panel = this.generateContainer(SELECTORS.XRGalleryPosterPanelContainer, this.scene);
    this.containers.poster.title = this.generateContainer(SELECTORS.XRGalleryPosterTitleContainer, this.containers.poster.panel);
    this.containers.poster.titleContent = document.getElementById(SELECTORS.GalleryStage);
    this.boardList.length = 0;
    this.hudUIList.length = 0;

    const data = posterData[category];
    const amount = data.imgPath.length;

    for (let i = 0; i < amount; i++)
    {
      const parameter =
      {
        index: i,
        name: `poster${i}`,
        category,
        boardId: BOARD_ID.Poster,
        containers: {
          board: this.containers.poster.panel,
          boardContentBody: data.imgPath[i],
          title: this.containers.poster.title,
          titleContent: this.containers.poster.titleContent,
          titleContentBody: data.posterTitle[i]
        },
        data
      };
      this.boardList.push(new PosterBoard_xr(parameter));
    }
    this.generateHUD();
    this.showBoard(34);
  },

  generateHUDs()
  {
    // this.generateHUD();
    this.generateHUD(BOARD_ID.UI.BackToCategory, [0, 12, 0]);
    invoke(() => { this.generateHUD(BOARD_ID.UI.ShowCategoryA, [0, 12, 0], 10)});
    invoke(() => { this.generateHUD(BOARD_ID.UI.ShowCategoryD, [0, 12, 0], 20)});
    invoke(() => { this.generateHUD(BOARD_ID.UI.ShowCategoryG, [0, 12, 0], 30)});
    invoke(() => { this.generateHUD(BOARD_ID.UI.VRModeStart, [0, 12, 0], 40)});

    invoke(() => {
      this.showBoard(34, this.boardList, 20);
      this.showBoard(34, this.hudUIList, 20, -150);
    }, 50);
  },

  generateCategory(data = posterData)
  {
    this.containers.category.board = this.generateContainer(SELECTORS.XRCategoryBoardContainer, this.scene);
    this.boardList.length = 0;
    this.hudUIList.length = 0;

    const boardContent = document.getElementById(SELECTORS.CategoryStage);
    const keys = Object.keys(data);
    const amount = keys.length;
    for (let i = 0; i < amount; i++)
    {
      const parameter =
      {
        index: i,
        name: `category${i}`,
        category: keys[i],
        boardId: BOARD_ID.Category,
        containers: {
          board: this.containers.category.board,
          boardContent
        },
        data
      };
      this.boardList.push(new CategoryBoard_xr(parameter));
    }
    this.generateHUDs();
  },

  addEvent()
  {
    Action.add(EVENT.ShowPoster, data => {
      console.log(`Category ${data}`);
      if (data != null) {
        this.destroy();
        this.generatePosters(data);
      }
    });

    Action.add(EVENT.ShowDetail, this.destroy);

    Action.add(EVENT.BackToCategory, () => {
      this.destroy();
      this.generateCategory(posterData);
    });

    Action.add(EVENT.BackToPoster, this.generatePosters);
  }
}
