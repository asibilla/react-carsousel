import { CarouselPositions } from './carousel.classes';

/**
 * This method is needed when there is more than one image per slide. 
 * Takes our array of slide object and returns an array of arrays of 
 * slide objects. 
 */
export function groupSlides(slides) {
  let groupedSlides = [];
  while (slides.length) {
    groupedSlides.push(slides.splice(0, this.config.imagesPerSlide));
  }
  if (this.infinite) {
    // Duplicate slides. (If there are only 2, we need more so that infinite looping 
    // will properly work).
    groupedSlides = this.loopSlides(groupedSlides.concat(groupedSlides.slice()), false);
  }
  return groupedSlides;
}

/**
 * Maintains infinite looping. Returns a new array that pulls the 
 * first slide from the existing array and makes it last (next) or the
 * last slide from the existing array and makes it first (previous).
 */
export function loopSlides(slides, advance = true) {
  let orderedSlides = [], slideToMove;
  slides.forEach((slide, index) => {
    if ((advance && index === 0) || (!advance && index === slides.length - 1)) {
      slideToMove = slide;
    }
    else {
      orderedSlides.push(slide);
    }
  });
  if (advance) {
    orderedSlides.push(slideToMove);
  }
  else {
    orderedSlides.unshift(slideToMove);
  }
  return orderedSlides;
}

export function setPositions() {
  this.setState({positions: new CarouselPositions(this.view.clientWidth, this.infinite)});
  this.setState({isMobile: window.innerWidth <= this.config.mobileBreakpoint});
}

/**
 * Helper for setting the 'positions' property of the state.
 */
export function setPositionProps(prevState, newPositions) {
  let newState = Object.assign({}, prevState);
  newState.positions = Object.assign(prevState.positions, newPositions);
  return newState;
}

/**
 * Keeps track of the currently displayed for the slide indicator component.
 */
export function getCurrentSlide(prevIndex, isNext) {
  let newIndex = (isNext) ? prevIndex + 1 : prevIndex - 1;
  if (newIndex < 0) {
    newIndex = this.slideCount - 1;
  }
  else if (newIndex >= this.slideCount) {
    newIndex = 0;
  }
  return newIndex;
}

export function animateCarousel(instructions) {
  this.setState(prevState => {
    let newState = setPositionProps(prevState, {currentPosition: instructions.position, animationTime: instructions.speed});
    
    // If the carousel has moved, advance the slide indicators.
    if (instructions.hasMoved) {
      newState.currentSlide = this.getCurrentSlide(prevState.currentSlide, instructions.hasAdvanced);
    }
    return newState;
  }, () => {

    // Slide has either progressed to next or previous.
    if (instructions.hasMoved && this.infinite) {
      window.setTimeout(() => {
        this.setState(prevState => {
          
          // If our slide has advanced, we need to re-arrange our slides to maintain an infinite loop.
          // Wait until after the animation is complete.
          let newPositions = { currentPosition: prevState.positions.defaultPosition, animationTime : 0};
          let newState = this.setPositionProps(prevState, newPositions);
          newState.slides = this.loopSlides(prevState.slides, instructions.hasAdvanced);
          return newState;
        }, () => {
          this.animationInProgress = false;
          if (this.config.autoAdvance) {
            this.autoAdvance();
          }
        });
      }, instructions.speed);
    }
    else {
      this.animationInProgress = false;
    }
  });
}

export function autoAdvance() {
  if (!this.autoAdvanceTimeout && this.config.autoAdvance) {
    this.autoAdvanceTimeout = setInterval(() => this.click(null, true), this.config.autoAdvanceSpeed);
  }
}

export function clearAutoAdvance() {
  if (this.autoAdvanceTimeout) {
    clearInterval(this.autoAdvanceTimeout);
    this.autoAdvanceTimeout = null;
  } 
}

/**
 * Determines whether or not carousel arrows will be displayed based
 * on config and current window width. 
 */
export function returnArrowContainerStyle(state, config) {
  if ((!state.isMobile && !config.showArrowsOnDesktop) || (state.isMobile && !config.showArrowsOnMobile)) {
    return {display: 'none'};
  }
  return {};
}

export function returnArrowStyle(state, config, left = false) {
  if (state.positions && !config.infiniteLoop) {
    let inactive = {opacity: '0.3'};
    if (state.positions.currentPosition >= 0 && left) {
      return inactive;
    }
    let rightEdge = ((state.slides.length / config.imagesPerSlide) * state.positions.width - state.positions.width) * -1;
    if (state.positions.currentPosition <= rightEdge && !left) {
      return inactive;
    }
  }
  return {};
}
