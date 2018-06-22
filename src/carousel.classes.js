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

class EventThreshold {
  constructor(
    pos,
    width,
    infinite,
    slideCount
  ) {
    this.snapBackPosition = pos;

    // Below values can be tweaked to adjust touch behavior.
    this.advanceThreshold = width / 3.5;
    this.elasticEdgeThreshold = width / 4;
    this.xToYRatio = 1;
    this.preventVerticalThreshold = 8;
    this.animationTimeFactor = 150;

    if (infinite) {
      this.setInifiniteThresholds(width);
    }
    else {
      this.setFiniteThresholds(pos, width, slideCount);
    }
  }

  setInifiniteThresholds(width) {
    this.maxLeft = width * -2;
    this.maxRight = 0;
    this.advancePosition = this.maxLeft;
    this.previousPosition = this.maxRight;
  }

  setFiniteThresholds(pos, width, slideCount) {
    let maxAdvance = (slideCount * width - width + this.elasticEdgeThreshold) * -1;
    this.advancePosition = (pos - width < maxAdvance) ? this.snapBackPosition : pos - width;
    this.previousPosition = (pos + width > this.elasticEdgeThreshold) ? this.snapBackPosition : pos + width;
    this.maxLeft = (pos - width >= maxAdvance) ? this.advancePosition : maxAdvance;
    this.maxRight = (pos + width <= this.elasticEdgeThreshold) ? this.previousPosition : this.elasticEdgeThreshold;
  }
}

class AnimationInstructions {
  constructor(
    position,
    speed, 
    hasMoved,
    hasAdvanced
  ) {
    this.position = position;
    this.speed = speed;
    this.hasMoved = hasMoved;
    this.hasAdvanced = hasAdvanced;
  }
}

export class CarouselClickEvent {
  constructor(
    next,
    currentPos,
    currentWidth,
    infinite,
    slideCount,
    speed
  ) {
    this.thresholds = new EventThreshold(
      currentPos, 
      currentWidth, 
      infinite, 
      slideCount
    );
    this.next = next;
    this.speed = speed;
  }

  get animationInstructions() {
    let animationInstructions = new AnimationInstructions(
      this.thresholds.advancePosition,
      this.speed,
      false,
      false
    );
    if (this.next) {
      animationInstructions.hasMoved = this.thresholds.advancePosition !== this.thresholds.snapBackPosition;
      animationInstructions.hasAdvanced = true;
    }
    else {
      animationInstructions.position = this.thresholds.previousPosition;
      animationInstructions.hasMoved = this.thresholds.previousPosition !== this.thresholds.snapBackPosition;
    }
    return animationInstructions;
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
    this.thresholds = new EventThreshold(currentPos, currentWidth, infinite, slideCount);
  }

  touchMove(event) {
    this.deltaX = Math.round(event.changedTouches[0].clientX) - this.startX;
    this.deltaY = Math.abs(event.changedTouches[0].clientY - this.startY);
    
    // This stops native vertical scrolling if it doesn't meet a threshold.
    // Prevents wobbling when scrolling the carousel horizontally.
    if (Math.abs(this.deltaY) < this.thresholds.preventVerticalThreshold) {
      event.preventDefault();
    }

    let newPosition = this.startPos + this.deltaX;

    // Make sure this is an intentional horizontal movement.
    if (Math.abs(this.deltaY) / Math.abs(this.deltaX) < this.thresholds.xToYRatio) {
      // Make sure user can't scroll past next/prev slide.
      if (newPosition >= this.thresholds.maxLeft && newPosition <= this.thresholds.maxRight) {
        return newPosition;
      }
    }

    // Tell the frontend not to move the carousel. 
    return null;
  }

  touchEnd(endPosition) {
    let animationInstructions = new AnimationInstructions(
      this.thresholds.snapBackPosition,
      0, 
      false,
      false
    );

    // If over threshold, animate to previous slide.
    if (this.deltaX > this.thresholds.advanceThreshold) {
      animationInstructions.speed = Math.abs(this.thresholds.maxRight - endPosition) + this.thresholds.animationTimeFactor;
      animationInstructions.position = this.thresholds.previousPosition;
      animationInstructions.hasMoved = animationInstructions.position !== this.thresholds.snapBackPosition;
    }

    // If less than neg threshold, animate to next slide. 
    else if (this.deltaX < this.thresholds.advanceThreshold * -1) {
        animationInstructions.speed = Math.abs(endPosition - (this.thresholds.maxLeft)) + this.thresholds.animationTimeFactor;
        animationInstructions.position = this.thresholds.advancePosition;
        animationInstructions.hasMoved = animationInstructions.position !== this.thresholds.snapBackPosition;
        animationInstructions.hasAdvanced = true;
    }

    // Otherwise, snap back to the start position.
    else {
        animationInstructions.speed = Math.abs(endPosition - this.startPos) + this.thresholds.animationTimeFactor;
    }

    return animationInstructions;
  }
}
