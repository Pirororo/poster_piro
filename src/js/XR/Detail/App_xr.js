import axios from "axios";

import { BOARD_ID, SELECTORS } from "../../Utils/Props";
import { EVENT, Action } from "./../../Utils/EventManager"

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
    this.endPoint = "https://openhouse.nii.ac.jp/wp/wp-json/wp/v2/posts/";
    this.addEvent();
  },

  fetchEntry(slug)
  {
    return new Promise((resolve, reject) => {

      axios.get(`${this.endPoint}?slug=${slug}`)
      .then(result => {
        if ("data" in result && result.data.length > 0)
        {
          resolve(result.data[0].acf);
        }
        else
        {
          reject("Data is empty.");
        }
      })
      .catch(error => reject(error))
    });
  },

  async generateContent(slug = "a01")
  {
    this.containers.detail.board = this.generateContainer(SELECTORS.XRDetailContainer, this.scene);
    this.boardList.length = 0;
    this.hudUIList.length = 0;

    const contents = [];
    const boardContent = document.getElementById(SELECTORS.DetailStage);
    const data = await this.fetchEntry(slug).catch(error => {
      console.error(error);
    });

    if (data == null) {
      Action.dispatch(EVENT.BackToPoster);
      return;
    }

    // generate images
    const pdfs = [ data.pdf_name_01, data.pdf_name_02, data.pdf_name_03 ].filter(data => data != "");
    pdfs.forEach(pdf => {
      contents.push({ image: `${pdf}.png` });
    });

    // generate Summary
    const {
      category_jp,
      category_en,
      theme_jp,
      theme_en,
      title_jp,
      title_en,
      leader_name_jp,
      leader_name_en,
      research_field_jp,
      research_field_en,
      group_members_jp,
      group_members_en
    } = data;
    contents.push({ meta: {
      slug,
      category_jp,
      category_en,
      theme_jp,
      theme_en,
      title_jp,
      title_en,
      leader_name_jp,
      leader_name_en,
      research_field_jp,
      research_field_en,
      group_members_jp,
      group_members_en
    }});

    // generate summery body
    const {
      summary_jp,
      summary_en
    } = data;
    const summaries = [];

    this.generatePanelFromSentence(summary_jp, summaries, "。", 300);
    this.generatePanelFromSentence(summary_en, summaries, " ", 700);
    summaries.forEach(summary => contents.push({ summary: { summary }}));

    // create boards from contents
    const amount = contents.length;
    for (let i = 0; i < amount; i++)
    {
      const parameter =
      {
        index: i,
        name: `detail_${i}`,
        // category: data.categories[0],
        boardId: BOARD_ID.Detail,
        containers: {
          board: this.containers.detail.board,
          boardContent
        },
        data: contents[i]
      };

      this.boardList.push(new DetailBoard_xr(parameter));
    }
    this.showBoard(50, this.boardList, 19);
    this.generateHUD(BOARD_ID.UI.BackToPoster, [0, 14, -19]);
  },

  generatePanelFromSentence(sentence, panels = [], delimiter = "。", limit = 300, start = 0)
  {
    if (sentence.length > limit)
    {
      const ending = sentence.indexOf(delimiter, limit);
      if (ending > -1)
      {
        panels.push(sentence.substring(start, ending + 1));
        this.generatePanelFromSentence(sentence, panels, delimiter, ending + limit + 1, ending + 1);
      }
      else
      {
        panels.push(sentence.substring(start, limit));
        this.generatePanelFromSentence(sentence, panels, delimiter, limit + limit, start + limit);
      }
    }
    else
    {
      const rest = sentence.substring(start);
      if (rest.length > 0)
      {
        panels.push(rest);
      }
    }
  },

  addEvent()
  {
    Action.add(EVENT.ShowDetail, e => this.generateContent(e.slug));
    Action.add(EVENT.BackToPoster, () => this.destroy());
  }
}
