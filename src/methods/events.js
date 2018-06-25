import { CarouselTouchEvent, CarouselClickEvent } from '../classes/carousel.classes';

/**
 * @param {Event} event
 * @returns {void}
 * 
 * Handler for ontouchstart event. Creates an instance of 
 * CarouselTouchEvent, which sets initinial touch data.
 */
export function touchStart(event) {
  if (!this.animationInProgress) {
    this.animationInProgress = true;
    this.clearAutoAdvance();
    this.touchEvent = new CarouselTouchEvent(
      event.nativeEvent, 
      this.state.positions.currentPosition, 
      this.state.positions.width,
      this.infinite,
      this.state.slides.length
    );
  }
}

/**
 * @param {Event} event 
 * @returns {void}
 * 
 * Handler for ontouchmove event. Recieves updated position data
 * and saves it to the state.
 */
export function touchMove(event) {
  let newPosition = this.touchEvent.touchMove(event.nativeEvent);
  if (newPosition) {
    this.setState((prevState) => this.setPositionProps(prevState, {currentPosition: newPosition}));
  }
}

/**
 * @param {Event} event 
 * @returns {void}
 * 
 * Handler for ontouchend event. Recieves updated position data
 * and passes it to the animateCarousel method.
 */
export function touchEnd() {
  let animateInstructions = this.touchEvent.touchEnd(this.state.positions.currentPosition);
  this.animateCarousel(animateInstructions);
}

/**
 * @param {Event} event 
 * @param {boolean} next 
 * @returns {void}
 * 
 * Click handler for left/right arrows. Creates an instance of 
 * CarouselClickEvent and passes the returned data to the 
 * animateCarousel method.
 */
export function click(event, next) {
  if (event) {
    event.stopPropagation();
    this.clearAutoAdvance();
  }
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
