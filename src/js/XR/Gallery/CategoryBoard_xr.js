import * as THREE from "three";
import BoardViewBase from "../Common/BoardViewBase";
import Content from "./CategoryBoardContent";

export default class CategoryBoard_xr extends BoardViewBase
{
  constructor(params)
  {
    super(params);

    this.width = 12;
    this.height = this.width;
    this.scale = new THREE.Vector3(this.width, this.height, 1);
    this.init();
  }

  init()
  {
    this.containers.boardContentBody = this.createContent(Content(this.params));
    this.createBoard();

    this.hide();
    this.fadeIn();
  }
}
