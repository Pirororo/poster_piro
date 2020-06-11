import { SELECTORS, KEYCODE } from "../Utils/Props";
import { EVENT, Action } from "../Utils/EventManager";

export default class App {
  constructor()
  {
    this.isEnable = false;
    this.detail = document.getElementById(SELECTORS.DetailContainer);
    this.gallery = document.getElementById(SELECTORS.GalleryContainer);

    this.close_btn = document.getElementById('close');
    this.close_btn.classList.add('no_show');
    this.frame_container = document.getElementById('frame_container');
    this.iframe = document.getElementById('detail_iframe');
    this.modal_box = document.getElementById('modal_box');
    this.slide = document.getElementById('slide');

  }

  init()
  {
    document.querySelector('body').setAttribute('id', 'pc');

    this.onResize();
    this.addEvent();
  }

  draw()
  {

  }

  onResize()
  {
    this.inner_container = this.iframe.contentWindow.document.getElementById('wp-container');
    if (this.inner_container) {
      if (window.innerWidth < 750) {
        this.inner_container.style.width = "90vw";
        this.inner_container.style.margin = "0 auto";
      } else {
        this.inner_container.style.width = "700px";
      }
    } else {
      console.log('no inner_container');
    }

  }

  onClick(e)
  {
    console.log(e.target.id);
    console.log(e.target.classList);

    if (e.target.id === 'close') {
        this.frame_container.classList.remove('fade-in');
        this.close_btn.classList.add('no_show');
        this.hide();
    }

    if (e.target.id === 'close_modal') {
      document.getElementById('modal_box').style.display = "none";
    }

    if (e.target.tagName === 'img') {
      // e.preventDefault();
      console.log(e.target.src);
      this.showModal(e);
      
    }
  }

  onKeyUp(e)
  {

  }

  addEvent()
  {
    Action.add(EVENT.ShowDetail, e => {
      this.slug = e.slug;
      console.log(`received: ${this.slug}`);

      this.iframe.src = `https://openhouse.nii.ac.jp/wp/${this.slug}/`;
      this.iframe.onload = this.showPage();
        
    });
  }

  show()
  {
    this.isEnable = true;
    this.detail.style.visibility = "visible";
    this.detail.style.opacity = 1;
    // this.gallery.style.visibility = "hidden";
  }

  hide()
  {
    this.isEnable = false;
    this.detail.style.visibility = "hidden";
    // this.gallery.style.visibility = "visible";
  }

  showPage()
  {
    setTimeout(() => {
      this.show();
      this.frame_container.classList.add('fade-in');
      this.close_btn.classList.remove('no_show');
    }, 800);
  }

  showModal(e)
  {
    this.slide.src = e.target.src;
    this.modal_box.style.display = "block";
    this.slide.style.display = "block";
  }
}


