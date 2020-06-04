import { posterData } from "../../Gallery/posterData";
import { BOARD_ID, EVENT, SELECTORS } from "../../Utils/Props";

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
    this.showBoard(34);
    this.generateHUD();
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
    this.showBoard(34);
  },

  addEvent()
  {
    document.addEventListener(EVENT.ShowPoster, e => {

      const category = e.detail.data;
      console.log(`Category ${category}`);
      if (category != null) {
        this.destroy();
        this.generatePosters(category);
      }
    });
    document.addEventListener(EVENT.ShowDetail, e => {
      this.destroy();
    });
    document.addEventListener(EVENT.BackToCategory, e => {

        this.destroy();
        this.generateCategory(posterData);
    });
    document.addEventListener(EVENT.BackToPoster, e => {

      this.generatePosters();
    });
  }
}
