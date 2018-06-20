import React from 'react';
import { view, slides, slide, imageStyle } from './glamorStyles';
import { CarouselPositions, CarouselTouchEvent } from './carousel.classes';


const defaultConfig = {
  imagesPerSlide: 1,
  infiniteLoop: false,
};

export default class GlamorousReactCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.config = Object.assign(defaultConfig, props.config || {});
    this.state = {
      images: this.groupImages((props.images || []).slice()),
      view: null,
      positions: null
    }
    // Bind instance to setPosition for window event listeners.
    this.setPositions = this.setPositions.bind(this);
  }

  get infinite() {
    return this.config.infiniteLoop;
  }

  groupImages(images) {
    let groupedImages = [];
    while (images.length) {
      groupedImages.push(images.splice(0, this.config.imagesPerSlide));
    }
    if (this.infinite) {
      this.loopImages(groupedImages, false)
    }
    return groupedImages;
  }

  loopImages(images, advance = true) {
    if (advance) {
       return images.push(images.splice(0, 1));
    }
    return images.unshift(images.splice(images.length - 1, 1));
  }

  setPositions() {
    if (this.state.view) {
      this.setState({positions: new CarouselPositions(this.state.view.clientWidth, this.infinite)});
    }
  }

  componentDidMount() {
    this.setState({positions: new CarouselPositions(this.view.clientWidth, this.infinite)});
    this.setState({view: this.view});
    window.addEventListener("resize", this.setPositions);
    window.addEventListener("orientationchange", this.setPositions);
  }

  touchStart(event) {
    this.touchEvent = new CarouselTouchEvent(event.nativeEvent, this.state.positions.currentPosition);
  }

  touchMove(event) {
    let newPosition = this.touchEvent.touchMove(event.nativeEvent);
    if (newPosition && newPosition >= this.state.positions.maxLeft && newPosition <= this.state.positions.maxRight) {
      // TODO: ADD Additional check for no inifinite thresholds
      this.setState((prevState) => {
        let newState = Object.assign({}, prevState);
        newState.positions.currentPosition = newPosition;
        return newState;
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setPositions);
    window.removeEventListener("orientationchange", this.setPositions);
  }

  render() {
    return (
      <div 
        className={view} 
        ref={el => this.view = el} 
        onTouchStart={e => this.touchStart(e)}
        onTouchMove={e => this.touchMove(e)}
      >
        { (this.state.view && this.state.positions) ?
        <div className={slides} style={this.state.positions.getPositionStyle(this.state.positions.currentPosition)}>
        { 
          this.state.images.map((imageGroup, index) => 
            <div className={slide} key={`imagegroup${index}`}>
              {
                imageGroup.map((image, childIndex) => 
                  <div key={`image${childIndex}`}>
                    <img className={imageStyle} src={image} />
                  </div>
                )
              }
            </div>
          )
        }
        </div>
        : ''}
      </div>
    );
  }
}
