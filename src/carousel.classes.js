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
      transform: `translate(${this.currentPosition}px)`,
      WebkitTransform: `translate(${this.currentPosition}px)`,
      transistionDuration: `${this.animationTime}ms`,
      WebkitTransitionDuration: `${this.animationTime}ms`
    }
  }
}

export class CarouselTouchEvent {
  constructor(
    event,
    currentPos,
    currentWidth,
    defaultPosition
  ) {
    this.startPos = currentPos;
    this.startX = Math.round(event.changedTouches[0].clientX);
    this.startY = Math.round(event.changedTouches[0].clientY);
    this.deltaX = 0;
    this.deltaY = 0;

    // TODO: Make this threshold configurable
    this.currentWidth = currentWidth;
    this.advanceThreshold = currentWidth / 3.5;
    this.maxLeft = currentWidth * -2;
    this.maxRight = 0;
    this.defaultPosition = defaultPosition;
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
      if (newPosition >= this.maxLeft && newPosition <= this.maxRight) {
        return newPosition;
      }
    }

    // Tell the frontend not to move the carousel. 
    return null;
  }

  touchEnd(endPosition) {
    let animateInstructions = {
      position: this.defaultPosition,
      duration: 0
    }

    // If over threshold, animate to previous slide.
    if (this.deltaX > this.advanceThreshold) {
      animateInstructions.duration = Math.abs(0 - endPosition) + 150;
      animateInstructions.position = this.maxRight;
    }

    // If less than neg threshold, animate to next slide. 
    else if (this.deltaX < this.advanceThreshold * -1) {
        animateInstructions.duration = Math.abs(endPosition - (this.currentWidth * -2)) + 150;
        animateInstructions.position = this.maxLeft;
    }

    // Otherwise, snap back to the start position.
    else {
        animateInstructions.duration = Math.abs(endPosition - this.startPos) + 150;
    }

    return animateInstructions;
  }
}
