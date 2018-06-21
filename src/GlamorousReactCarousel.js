import React from 'react';
import { 
  view, 
  slide, 
  imageStyle, 
  arrowContainer, 
  arrowContainerLeft, 
  arrowContainerRight, 
  arrow } from './glamorStyles';
import { returnArrowContainerStyle, returnArrowStyle } from './carousel.methods';
import { CarouselPositions, CarouselTouchEvent } from './carousel.classes';


// TODO: Add capability to link images,


const defaultConfig = {
  imagesPerSlide: 1,
  infiniteLoop: false,
  mobileBreakpoint: 1023,
  showArrowsOnMobile: false,
  showArrowsOnDesktop: true,
  leftArrowClass: 'g72-arrow-thin-left',
  rightArrowClass: 'g72-arrow-thin-right'
};

export default class GlamorousReactCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.config = Object.assign(defaultConfig, props.config || {});
    this.state = {
      images: this.groupImages((props.images || []).slice()),
      view: null,
      positions: null,
      isMobile: false,
      rightArrow: null,
      leftArrow: null
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
      // Duplicate slides. (If there are only 2, we need more so that infinite looping 
      // will properly work).
      groupedImages = groupedImages.concat(groupedImages.slice());
      this.loopImages(groupedImages, false);
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
    this.setState({positions: new CarouselPositions(this.view.clientWidth, this.infinite)});
    this.setState({isMobile: window.innerWidth <= this.config.mobileBreakpoint});
  }

  copyObject(obj) {
    return Object.assign({}, obj);
  }

  componentDidMount() {
    this.setPositions();
    this.setState({view: this.view});
    window.addEventListener("resize", this.setPositions);
    window.addEventListener("orientationchange", this.setPositions);
  }

  touchStart(event) {
    if (!this.touchEventInProgress) {
      this.touchEventInProgress = true;
      this.touchEvent = new CarouselTouchEvent(
        event.nativeEvent, 
        this.state.positions.currentPosition, 
        this.state.positions.width,
        this.infinite,
        this.state.images.length
      );
    }
  }

  touchMove(event) {
    let newPosition = this.touchEvent.touchMove(event.nativeEvent);
    if (newPosition) {
      // TODO: ADD Additional check for no inifinite thresholds
      this.setState((prevState) => {
        let newState = this.copyObject(prevState);
        newState.positions.currentPosition = newPosition;
        return newState;
      });
    }
  }

  touchEnd() {
    let animateInstructions = this.touchEvent.touchEnd(this.state.positions.currentPosition);
    this.setState((prevState) => {
      let newState = this.copyObject(prevState);
      newState.positions.currentPosition = animateInstructions.position;
      newState.positions.animationTime = animateInstructions.duration;
      return newState;
    }, () => {
      // If our slide has advanced, we need to re-arrange our slides to maintain an infinite loop.
      // Wait until after the animation is complete.
      if (this.state.positions.currentPosition !== this.state.positions.defaultPosition && this.infinite) {
        window.setTimeout(() => {
          this.setState(prevState => {
            let newState = this.copyObject(prevState);
            newState.images = this.loopImages(newState.images, (animateInstructions.position < 0));
            newState.positions.animationTime = 0;
            newState.positions.currentPosition = prevState.positions.defaultPosition;
          }, () => {
            this.touchEventInProgress = false;
          });
        }, animateInstructions.duration);
      }
      else {
        this.touchEventInProgress = false;
      }
    });
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
        onTouchEnd={e => this.touchEnd(e)}
        onTouchCancel={() => this.touchEventInProgress = false}
      >
        <div className={`${arrowContainer} ${arrowContainerLeft}`} style={returnArrowContainerStyle(this.state, this.config)}>
          <div className={`${this.config.leftArrowClass} ${arrow}`} style={returnArrowStyle(this.state, this.config, true)}></div>
        </div>
        <div className={`${arrowContainer} ${arrowContainerRight}`} style={returnArrowContainerStyle(this.state, this.config)}>
        <div className={`${this.config.rightArrowClass} ${arrow}`} style={returnArrowStyle(this.state, this.config, false)}></div>
        </div>
        { (this.state.view && this.state.positions) ?
          <div className="slides" style={this.state.positions.getPositionStyle()}>
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
