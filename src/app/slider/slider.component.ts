import { Component, OnInit, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements AfterViewInit {

  @Input() images: string[];

  public isLoaded: boolean[] = [];

  private isMouseDown: boolean = false;
  private startMovingData: any;
  private containerMiddle: number;
  private activeImageIndex: number = 0;

  constructor() { }

  ngAfterViewInit() {
    for (let i in this.images) this.isLoaded[Number(i)] = false;
    const imageContainer = document.getElementById("imageContainer");
    this.containerMiddle = (imageContainer.offsetWidth / 2) + imageContainer.getBoundingClientRect().left;

    this.setImagePositions();

    this.loadImage();

    this.isLoaded[0] = true;

    document.addEventListener("mousemove", e => e.preventDefault());
  }

  setImagePositions() {
    for (let i in this.images) {
      if (Number(i) == this.activeImageIndex) continue;

      else if (Number(i) < this.activeImageIndex) {
        const nextImage = document.getElementById("image" + (Number(i) + 1));
        const curImage = document.getElementById("image" + i);
        Object.assign(curImage.style, { left: (nextImage.offsetLeft - curImage.offsetWidth) + "px" })
      }
      else {
        const preImage = document.getElementById("image" + (Number(i) - 1));
        const curImage = document.getElementById("image" + i);
        Object.assign(curImage.style, { left: (preImage.offsetLeft + preImage.offsetWidth) + "px" })
      }
    }
  }

  loadImage() {
    if (this.isLoaded[this.activeImageIndex]) return;

    const image = document.getElementById("image" + this.activeImageIndex);
    image.setAttribute('src', this.images[this.activeImageIndex]);

    image.addEventListener("mousedown", this.mousedown.bind(this));

    image.addEventListener("mouseup", this.mouseup.bind(this));

    image.addEventListener("mousemove", this.mousemove.bind(this))

    image.addEventListener("mouseout", this.mouseout.bind(this));

    image.addEventListener('touchstart', this.touchStart.bind(this), false);

    image.addEventListener('touchmove', this.touchMove.bind(this), false);

    image.addEventListener('touchend', this.touchLeave.bind(this), false);

    image.addEventListener('touchleave', this.touchLeave.bind(this), false);

    image.addEventListener('touchcancel', this.touchLeave.bind(this), false);


    this.isLoaded[this.activeImageIndex] = true;

  }

  touchStart(e) {
    const image = document.getElementById("image" + this.activeImageIndex);
    this.isMouseDown = true;
    this.startMovingData = {
      imageLeft: image.offsetLeft,
      imageTop: image.offsetTop,
      width: image.offsetWidth,
      mouseX: e.changedTouches[0].pageX
    }
  }

  touchLeave() {
    this.leaveTheImage();
    this.setImagePositions();
    this.isMouseDown = false;
  }

  touchMove(e) {
    e.preventDefault();
    const image = document.getElementById("image" + this.activeImageIndex);
    if (this.isMouseDown) {
      let newStyleData = {
        position: "absolute",
        left: (this.startMovingData.imageLeft + (e.changedTouches[0].pageX - this.startMovingData.mouseX)) + "px",
        top: this.startMovingData.imageTop + "px",
        width: this.startMovingData.width
      }
      Object.assign(image.style, newStyleData);
      console.log(newStyleData)
      this.setImagePositions();
    }
  }

  mousedown(e) {
    const image = document.getElementById("image" + this.activeImageIndex);
    this.isMouseDown = true;
    this.startMovingData = {
      imageLeft: image.offsetLeft,
      imageTop: image.offsetTop,
      width: image.offsetWidth,
      mouseX: e.clientX
    }
  }

  mouseup() {
    if (!this.isMouseDown) return;
    this.leaveTheImage();
    this.setImagePositions();
    this.isMouseDown = false;
  }

  mouseout() {
    if (!this.isMouseDown) return;
    this.leaveTheImage();
    this.setImagePositions();
    this.isMouseDown = false;
  }

  mousemove(e) {
    e.preventDefault();
    const image = document.getElementById("image" + this.activeImageIndex);
    if (this.isMouseDown) {
      let newStyleData = {
        position: "absolute",
        left: (this.startMovingData.imageLeft + (e.clientX - this.startMovingData.mouseX)) + "px",
        top: this.startMovingData.imageTop + "px",
        width: this.startMovingData.width
      }
      Object.assign(image.style, newStyleData);
      console.log(newStyleData)
      this.setImagePositions();
    }
  }

  leaveTheImage() {
    const image = document.getElementById('image' + this.activeImageIndex);
    const container = document.getElementById('imageContainer');

    if (image.getBoundingClientRect().left >= this.containerMiddle && image.getBoundingClientRect().right > container.getBoundingClientRect().right) {
      this.moveOutRight(image, container);
    }

    else if (image.getBoundingClientRect().left < this.containerMiddle && image.getBoundingClientRect().right > container.getBoundingClientRect().right) {
      this.moveInLeft(image, container);
    }

    else if (image.getBoundingClientRect().right >= this.containerMiddle && image.getBoundingClientRect().left < container.getBoundingClientRect().left) this.moveInRight(image, container);
    else this.moveOutLeft(image, container);
  }

  public counter = 0;

  moveOutRight(elem: any, to: any) {
    console.log("Move 1");
    if (this.activeImageIndex === 0) {
      this.moveInLeft(elem, to);
      return;
    }
    if (this.counter > 2000) return;
    if (elem.getBoundingClientRect().left >= to.getBoundingClientRect().right) {
      this.activeImageIndex--;
      return;
    }
    const elemLeft = elem.style.left;

    let newLeft = Number(elemLeft.substr(0, elemLeft.length - 2)) + 10;

    if (newLeft > to.getBoundingClientRect().width) newLeft = to.getBoundingClientRect().width;

    Object.assign(elem.style, {
      position: "absolute",
      left: newLeft + "px",
    })
    this.setImagePositions();
    setTimeout(() => {
      this.counter++;
      this.moveOutRight(elem, to);
    }, 2)
  }

  moveOutLeft(elem: any, to: any) {
    console.log("Move 2")
    if (this.counter > 2000) return;

    if (this.activeImageIndex === this.images.length - 1) {
      this.moveInRight(elem, to);
      return;
    }
    if (elem.getBoundingClientRect().right <= to.getBoundingClientRect().left) {
      this.activeImageIndex++;
      this.loadImage();
      return;
    }

    const elemLeft = elem.style.left;
    let newLeft = Number(elemLeft.substr(0, elemLeft.length - 2)) - 10;

    if (newLeft + elem.getBoundingClientRect().width < 0) newLeft = elem.getBoundingClientRect().width * -1;

    Object.assign(elem.style, {
      position: "absolute",
      left: newLeft + "px",
    })
    this.setImagePositions();
    setTimeout(() => {
      this.counter++;
      this.moveOutLeft(elem, to);
    }, 2)
  }

  moveInRight(elem: any, to: any) {
    console.log("Move 3")
    if (this.counter > 2000) return;
    if (elem.getBoundingClientRect().right >= to.getBoundingClientRect().right) return;
    const elemLeft = elem.style.left;

    let newLeft = Number(elemLeft.substr(0, elemLeft.length - 2)) + 10;
    if (newLeft > 0) newLeft = 0;
    Object.assign(elem.style, {
      position: "absolute",
      left: newLeft + "px",
    })
    this.setImagePositions();
    setTimeout(() => {
      this.counter++;
      this.moveInRight(elem, to);
    }, 2)
  }

  moveInLeft(elem: any, to: any) {
    console.log("Move 4")
    if (this.counter > 2000) return;
    if (elem.getBoundingClientRect().left <= to.getBoundingClientRect().left) { return };
    const elemLeft = elem.style.left;

    let newLeft = Number(elemLeft.substr(0, elemLeft.length - 2)) - 10;
    if (newLeft < 0) newLeft = 0;
    Object.assign(elem.style, {
      position: "absolute",
      left: newLeft + "px",
    })
    this.setImagePositions();
    setTimeout(() => {
      this.counter++;
      this.moveInLeft(elem, to);
    }, 2)
  }

}
