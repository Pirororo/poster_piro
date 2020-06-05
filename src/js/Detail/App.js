import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
// import { CSS3DRenderer } from "three/examples/js/renderers/CSS3DRenderer";
import { CSS3DRenderer } from "./js/CSS3DRenderer";

import Element from "./js/Element";
import pdfElement from "./js/PdfElement";
import { EVENT, SELECTORS, KEYCODE } from "./../Utils/Props";

const App =
{
  props: {
    isEnable: false
  },
  init()
  {
    let { camera, scene, renderer, controls } = this.props;

    var container = document.getElementById(SELECTORS.DetailStage);

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( 0, 0, 2000 );

    scene = new THREE.Scene();

    renderer = new CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    var group = new THREE.Group();
    group.add( new pdfElement( 0, 300, 450, 0 ) );
    group.add( new Element( 'https://www.youtube.com/embed/G9AtkiCESAg', 1000, 0, 0,  -Math.PI / 8 ) );
    group.add( new Element( 'https://www.youtube.com/embed/9PVjlAm-A1A', -1000, 0, 0, Math.PI / 8 ) );
    group.add( new Element( 'https://salty-waters-60310.herokuapp.com/a07', 0, -300, 450, 0 ) );
    scene.add( group );

    controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 4;

    // Block iframe events when dragging camera

    var blocker = document.getElementById(SELECTORS.DetailBlocker);
    blocker.style.display = 'none';

    controls.addEventListener( 'start', function () {

      blocker.style.display = '';

    } );
    controls.addEventListener( 'end', function () {

      blocker.style.display = 'none';

    } );

    this.props = {
      ...this.props,
      ...{ camera, scene, renderer, controls }
    };

    this.addEvent();
  },

  draw()
  {
    const { controls, renderer, scene, camera } = this.props;

    controls.update();
    renderer.render( scene, camera );
  },

  onResize()
  {
    const { controls, renderer, scene, camera } = this.props;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  },

  onKeyUp(e)
  {
    if (e.keyCode === KEYCODE.SPACE)
    {
      this.hide();
    }
  },

  addEvent()
  {
    document.addEventListener(EVENT.ShowDetail, e => this.show());
  },

  show()
  {
    const detail = document.getElementById(SELECTORS.DetailContainer);
    const gallery = document.getElementById(SELECTORS.GalleryContainer);

    this.props.isEnable = true;
    detail.style.visibility = "visible";
    gallery.style.visibility = "hidden";
  },

  hide()
  {
    const detail = document.getElementById(SELECTORS.DetailContainer);
    const gallery = document.getElementById(SELECTORS.GalleryContainer);

    this.props.isEnable = false;
    detail.style.visibility = "hidden";
    gallery.style.visibility = "visible";
  }
};

export default App;