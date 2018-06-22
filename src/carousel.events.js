import { CarouselTouchEvent, CarouselClickEvent } from './carousel.classes';

export function touchStart(event) {
  if (!this.animationInProgress) {
    this.animationInProgress = true;
    this.touchEvent = new CarouselTouchEvent(
      event.nativeEvent, 
      this.state.positions.currentPosition, 
      this.state.positions.width,
      this.infinite,
      this.state.slides.length
    );
  }
}

export function touchMove(event) {
  let newPosition = this.touchEvent.touchMove(event.nativeEvent);
  if (newPosition) {
    this.setState((prevState) => this.setPositionProps(prevState, {currentPosition: newPosition}));
  }
}

export function touchEnd() {
  let animateInstructions = this.touchEvent.touchEnd(this.state.positions.currentPosition);
  this.animateCarousel(animateInstructions);
}

export function click(event, next) {
  event.stopPropagation();
  if (!this.animationInProgress) {
    this.animationInProgress = true;
    let clickEvent = new CarouselClickEvent(
      next, 
      this.state.positions.currentPosition, 
      this.state.positions.width,
      this.infinite,
      this.state.slides.length,
      this.config.advanceSpeed
    );
    this.animateCarousel(clickEvent.animationInstructions);
  }
}
