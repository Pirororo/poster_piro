import * as THREE from "three";
import { COMPONENTS, SELECTORS, BOARD_ID } from "../../Utils/Props";
import TWEEN from "@tweenjs/tween.js";

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
    this.opacity = 1;
    this.tween = null;

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

      entity.object3DMap.mesh.material.opacity = this.opacity;
    });
    TWEEN.update();
  }

  destroy()
  {
    // this.fadeOut(this.position)
    // setTimeout(() => {

      if(this.entities.board != null && this.entities.board.parentElement != null)
      {
        this.entities.board.remove();
        this.entities.board.destroy();
      }
      if (this.containers.boardContentBody != null && this.containers.boardContentBody.parentElement != null) {
        this.containers.boardContentBody.remove();
      }
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

  show()
  {
    this.opacity = 1;
  }

  hide()
  {
    this.opacity = 0;
  }

  fade(param = { y: -0.5, alpha: 0}, dest = { y: 0, alpha: 1}, duration = 1000, delay = 500, eachDelay = 200)
  {
    // const param =  { y: -0.5, alpha: 0 };
    this.tween = new TWEEN.Tween(param)
    .to(dest, duration)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      this.opacity = param.alpha;
      if ("y" in param) {
        this.position.y = param.y;
      }
    })
    .delay(delay == 0 ? 0 : this.index * eachDelay + delay)
    .start();
  }

  fadeIn(position)
  {
    if (position == null) { position = { y: 0 }; }
    this.fade({ y: position.y - 0.5, alpha: 0}, { y: position.y, alpha: 1 }, 1000, 500);
  }

  fadeOut(position)
  {
    if (position == null) { position = { y: 0 }; }
    this.fade({ y: position.y, alpha: 1 }, { y: position.y - 0.5, alpha: 0 }, 800, 0, 0);
  }

  onRaycastForcedOn(raycaster)
  {
  }

  onRaycastForcedOff(raycaster)
  {
  }
}
