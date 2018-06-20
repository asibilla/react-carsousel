export class CarouselPositions {
  constructor(
    width,
    inifinite = false
  ) {
    this.width = width;
    this.inifinite = inifinite;
    this.currentPosition = this.defaultPosition;
    this.maxLeft = this.width * -2;
    this.maxRight = 0;

    console.log('container width', this.width);
  }

  get defaultPosition() {
    return this.inifinite ? (this.width * -1) : 0;
  }

  getPositionStyle(pos) {
    return {
      transform: `translate(${pos}px)`
    }
  }
}

export class CarouselTouchEvent {
  constructor(
    event,
    currentPos
  ) {
    this.startPos = currentPos;
    this.startX = Math.round(event.changedTouches[0].clientX);
    this.startY = Math.round(event.changedTouches[0].clientY);
    this.deltaX = 0;
    this.deltaY = 0;
    this.startTime = new Date().getTime();
  }

  touchMove(event) {
    this.deltaX = Math.round(event.changedTouches[0].clientX) - this.startX;
    this.deltaY = Math.abs(event.changedTouches[0].clientY - this.startY);

    // TODO: Make this threshold configurable.
    // This stops native vertical scrolling if it doesn't meet a threshold.
    if (Math.abs(this.deltaY) < 8) {
      event.preventDefault();
    }

    // TODO: Make this threshold configurable.
    if (Math.abs(this.deltaY) / Math.abs(this.deltaX) < 1) {
      return this.startPos + this.deltaX;
    }

    return null;
  }
}
