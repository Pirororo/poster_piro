import * as THREE from "three";
import { BOARD_ID } from "../../Utils/Props";
import BoardViewBase from "../Common/BoardViewBase";

export default class PosterBoard_xr extends BoardViewBase
{
  constructor(params)
  {
    super(params);

    this.name = `poster${params.index}`;
    this.boardId = BOARD_ID.Poster;
    this.materials = {
      board: `shader: flat; color: #999; src: ${params.containers.boardContentBody}`,
      title: `shader: html; color: #999; transparent: true; target: #${this.name}`
    };
    this.entities = {
      ...this.entities,
      title: null
    };
    this.slug = this.category + (this.index < 10 ? "0" : "") + this.index;

    this.init();
  }

  init()
  {
    this.containers.titleContentBody = this.createContent(`
    <div class="gallery_poster_title">${this.containers.titleContentBody}</div>
    `, this.containers.titleContent);
    this.containers.title.object3D.position.set(0, -6.75, 0);
    this.createBoard("title", this.containers.title, this.materials.title, false);

    this.createBoard();
  }

  destroy()
  {
    super.destroy();

    if (this.containers.titleContentBody != null)
    {
      this.containers.title.removeChild(this.entities.title);
      this.containers.titleContent.removeChild(this.containers.titleContentBody);
      this.entities.title.destroy();
    }
  }

  onRaycastForcedOn(raycaster)
  {
    this.entities.title.object3DMap.mesh.material.color = new THREE.Color(1, 1, 1);
  }

  onRaycastForcedOff(raycaster)
  {
    this.entities.title.object3DMap.mesh.material.color = new THREE.Color(0.6, 0.6, 0.6);
  }
}