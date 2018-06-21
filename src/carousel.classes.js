export class CarouselPositions {
  constructor(
    width,
    inifinite = false
  ) {
    this.width = width;
    this.inifinite = inifinite;
    this.currentPosition = this.defaultPosition;
    this.animationTime = 0;
  }

  get defaultPosition() {
    return this.inifinite ? (this.width * -1) : 0;
  }

  getPositionStyle() {
    return {
      transform: `translate3d(${this.currentPosition}px, 0, 0)`,
      WebkitTransform: `translate3d(${this.currentPosition}px, 0, 0)`,
      transistionDuration: `${this.animationTime}ms`,
      WebkitTransitionDuration: `${this.animationTime}ms`
    }
  }
}

class TouchThreshold {
  constructor(
    pos,
    width,
    infinite,
    slideCount
  ) {
    this.advanceThreshold = width / 3.5;
    this.snapBackPosition = pos;

    if (infinite) {
      this.setInifiniteThresholds(width);
    }
    else {
      this.setFiniteThresholds(pos, width);
    }
  }

  setInifiniteThresholds(width) {
    this.maxLeft = width * -2;
    this.maxRight = 0;
    this.advancePosition = this.maxLeft;
    this.previousPosition = this.maxRight;
    this.rightEdge = this.maxLeft;
    this.leftEdge = this.maxRight;
  }

  setFiniteThresholds(pos, width) {

  }
}

export class CarouselTouchEvent {
  constructor(
    event,
    currentPos,
    currentWidth,
    infinite,
    slideCount
  ) {
    this.startPos = currentPos;
    this.startX = Math.round(event.changedTouches[0].clientX);
    this.startY = Math.round(event.changedTouches[0].clientY);
    this.deltaX = 0;
    this.deltaY = 0;
    this.thresholds = new TouchThreshold(currentPos, currentWidth, infinite, slideCount);

  }

  touchMove(event) {
    this.deltaX = Math.round(event.changedTouches[0].clientX) - this.startX;
    this.deltaY = Math.abs(event.changedTouches[0].clientY - this.startY);

    // TODO: Make this threshold configurable.
    
    // This stops native vertical scrolling if it doesn't meet a threshold.
    // Prevents wobbling when scrolling the carousel horizontally.
    if (Math.abs(this.deltaY) < 8) {
      event.preventDefault();
    }

    let newPosition = this.startPos + this.deltaX;

    // TODO: Make this threshold configurable.

    // Make sure this is an intentional horizontal movement.
    if (Math.abs(this.deltaY) / Math.abs(this.deltaX) < 1) {
      // Make sure user can't scroll past next/prev slide.
      if (newPosition >= this.thresholds.maxLeft && newPosition <= this.thresholds.maxRight) {
        return newPosition;
      }
    }

    // Tell the frontend not to move the carousel. 
    return null;
  }

  touchEnd(endPosition) {
    let animateInstructions = {
      position: this.thresholds.snapBackPosition,
      duration: 0
    }

    // If over threshold, animate to previous slide.
    if (this.deltaX > this.thresholds.advanceThreshold) {
      animateInstructions.duration = Math.abs(this.thresholds.maxRight - endPosition) + 150;
      animateInstructions.position = this.thresholds.previousPosition;
    }

    // If less than neg threshold, animate to next slide. 
    else if (this.deltaX < this.thresholds.advanceThreshold * -1) {
        animateInstructions.duration = Math.abs(endPosition - (this.thresholds.maxLeft)) + 150;
        animateInstructions.position = this.thresholds.advancePosition;
    }

    // Otherwise, snap back to the start position.
    else {
        animateInstructions.duration = Math.abs(endPosition - this.startPos) + 150;
    }

    return animateInstructions;
  }
}
