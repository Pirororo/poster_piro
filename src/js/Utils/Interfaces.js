/**
 * interfaces
 *
 * Defining interfaces to implement code with specific rules
 */

/**
 * interface ICommonFacadeModule
 */
 const ICommonFacadeModuleObject =
 {
  init(){ return this; },
  setup(){},
  update(){},
  draw(){},
  destroy(){},

  onResize(){},
  onMouseMove(e){},
  onKeyUp(e){},
  onClick(e){}
};

export {
	ICommonFacadeModuleObject
}