import { CarouselPositions } from './carousel.classes';

export function groupImages(images) {
  let groupedImages = [];
  while (images.length) {
    groupedImages.push(images.splice(0, this.config.imagesPerSlide));
  }
  if (this.infinite) {
    // Duplicate slides. (If there are only 2, we need more so that infinite looping 
    // will properly work).
    groupedImages = groupedImages.concat(groupedImages.slice());
    this.loopImages(groupedImages, false);
  }
  return groupedImages;
}

export function loopImages(images, advance = true) {
  if (advance) {
    let first = images.splice(0, 1);
    images.push(first);
  }
  else {
    let last = images.splice(images.length - 1, 1);
    images.unshift(last);
  }
}

export function setPositions() {
  this.setState({positions: new CarouselPositions(this.view.clientWidth, this.infinite)});
  this.setState({isMobile: window.innerWidth <= this.config.mobileBreakpoint});
}

/**
 * Creates a new state object with a deep copy of 
 * the positions property.
 */
export function setPositionProps(prevState, newPositions) {
  let newState = Object.assign({}, prevState);
  newState.positions = Object.assign(prevState.positions, newPositions);
  return newState;
}

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
          newState.images = prevState.images;
          this.loopImages(newState.images, instructions.hasAdvanced);
          return newState;
        }, () => {
          this.animationInProgress = false;
        });
      }, instructions.speed);
    }
    else {
      this.animationInProgress = false;
    }
  });
}

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
    let rightEdge = (state.images.length * state.positions.width - state.positions.width) * -1;
    if (state.positions.currentPosition <= rightEdge && !left) {
      return inactive;
    }
  }
  return {};
}
