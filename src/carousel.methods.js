export function setPositionProps(newProps = []) {

}

export function animateCarousel(pos, speed) {
  this.setState((prevState) => {
    let newState = this.copyObject(prevState);
    newState.positions.currentPosition = pos;
    newState.positions.animationTime = speed;
    return newState;
  }, () => {
    // If our slide has advanced, we need to re-arrange our slides to maintain an infinite loop.
    // Wait until after the animation is complete.
    if (this.state.positions.currentPosition !== this.state.positions.defaultPosition && this.infinite) {
      window.setTimeout(() => {
        this.setState(prevState => {
          let newState = this.copyObject(prevState);
          newState.images = prevState.images;
          this.loopImages(newState.images, (pos < 0));
          newState.positions.animationTime = 0;
          newState.positions.currentPosition = prevState.positions.defaultPosition;
          return newState;
        }, () => {
          this.animationInProgress = false;
        });
      }, speed);
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
