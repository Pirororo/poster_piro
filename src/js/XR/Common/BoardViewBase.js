import * as THREE from "three";
import { COMPONENTS, SELECTORS, BOARD_ID } from "../../Utils/Props";

export default class BoardBaseView_xr
{
  constructor(params)
  {
		this.params = params;

    this.index = params.index || 0;
    this.name = params.name || params.boardID || `Board${Date.now()}`;
    this.category = params.category;
    this.boardId = params.boardId || BOARD_ID.Category;

		this.entities = {
      board: null
    };
    this.width = 12;
		this.height = this.width * 0.5625; // 6.75
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Vector3();
    this.scale = new THREE.Vector3(this.width, this.height, 1);

    this.containers = {
      board: document.getElementById(SELECTORS.XRScene),
      boardContent: null,
      boardContentBody: null,
      ...params.containers
    };
    this.materials = {
      board: `shader: html; color: #ccc; transparent: true; target: #${this.name}`
    };
  }

  createBoard(
    key = "board",
    container = this.containers.board,
    material = this.materials.board,
    isRaycastTarget = true
    )
  {
    this.entities[key] = document.createElement("a-entity");
    this.entities[key].setAttribute("geometry", "primitive: plane");
    this.entities[key].setAttribute("material", material);
    this.entities[key].setAttribute(COMPONENTS.RaycastTarget, "");
    if (isRaycastTarget) {
      this.entities[key].setAttribute("class", SELECTORS.RaycastTarget);
    }
    this.entities[key].instance = this;

    container.appendChild(this.entities[key]);
  }

  createContent(content = "", container = this.containers.boardContent)
  {
    const contentBody = document.createElement("div");
    contentBody.setAttribute("id", `${this.name}`);
    contentBody.insertAdjacentHTML('afterbegin', content);
    container.appendChild(contentBody);
    return contentBody;
  }

  draw()
  {
    this.entities.forIn((k, entity) => {
      entity.setAttribute("position", this.position);
      entity.setAttribute("rotation", this.rotation);
      entity.setAttribute("scale", this.scale);
    });
  }

  destroy()
  {
    this.containers.board.removeChild(this.entities.board);
    if (this.containers.boardContent != null && this.containers.boardContentBody != null) {
      this.containers.boardContent.removeChild(this.containers.boardContentBody);
    }
    this.entities.board.destroy();
  }

  setPosition(x, y, z)
  {
    this.position.set(x, y, z);
  }

  lookAt(target)
  {
    if (target == null || !(target instanceof THREE.Vector3)) {
      target = new THREE.Vector3();
    }
    const y = 180 + Math.atan2(this.position.x - target.x, this.position.z - target.z) * 180 / Math.PI;

    this.rotation.set(0, y, 0);
  }

  onRaycastForcedOn(raycaster)
  {
  }

  onRaycastForcedOff(raycaster)
  {
  }
}
