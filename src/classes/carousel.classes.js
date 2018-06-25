/**
 * @param {number} width
 * @param {boolean} infinite
 * 
 * Links the carousel's movement to css positioning.
 */
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

  /**
   * @returns {number} the carousel's start position.
   */
  get defaultPosition() {
    return this.inifinite ? (this.width * -1) : 0;
  }

  /**
   * @returns {Object} the carousel position as a css object.
   */
  getPositionStyle() {
    return {
      transform: `translate3d(${this.currentPosition}px, 0, 0)`,
      WebkitTransform: `translate3d(${this.currentPosition}px, 0, 0)`,
      MozTransform: `translate3d(${this.currentPosition}px, 0, 0)`,
      transistionDuration: `${this.animationTime}ms`,
      WebkitTransitionDuration: `${this.animationTime}ms`,
      MozTransitionDuration: `${this.animationTime}ms`
    }
  }
}

/**
 * @param {number} pos
 * @param {number} width
 * @param {boolean} infinite
 * @param {number} slideCount
 * 
 * Sets limits and thresholds for advance based on
 * carousel movement. (e.g. How far a user must move
 * the carousel before it will move to the next slide
 * on release instead of snapping back to the previous slide).
 * Limits how far the carousel can move with a single swipe.
 */
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

/**
 * @param {number} position
 * @param {number} speed
 * @param {boolean} hasMoved
 * @param {boolean} hasAdvanced
 * 
 * Instructions passed to the animateCarousel method
 * that determine the direction/speed of animation.
 */
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

/**
 * @param {boolean} next
 * @param {number} currentPos
 * @param {number} currentWidth
 * @param {boolean} infinite
 * @param {number} slideCount
 * @param {number} speed
 * 
 * Converts a click event into an instance
 * of AnimationInstructions
 */
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

  /**
   * @returns {AnimationInstructions}
   */
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

/**
 * @param {Event} event
 * @param {number} currentPos
 * @param {number} currentWidth
 * @param {boolean} infinite
 * @param {number} slideCount
 * 
 * Links data from ontouchstart/ontouchmove/ontouchend events
 * to create an instance of AnimationInstructions. Instantiated
 * ontouchstart. The constructor sets the data that will be
 * modified by touchmove and touchend.
 */
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

  /**
   * @param {Event} event 
   * @returns {number} the number of pixels moved from touchstart. null if a limit is hit.
   */
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

  /**
   * @param {number} endPosition 
   * @returns {AnimationInstructions}
   */
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
