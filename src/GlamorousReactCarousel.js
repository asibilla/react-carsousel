import React from 'react';
import SlideIndicator from './SlideIndicator';
import Arrows from './Arrows';
import { 
  view, 
  slide, 
  imageStyle, 
} from './glamorStyles';
import {
  groupImages,
  loopImages,
  setPositions,
  animateCarousel,
  setPositionProps,
  returnArrowContainerStyle, 
  returnArrowStyle,
  getCurrentSlide
} from './carousel.methods';
import {
  click,
  touchStart,
  touchMove,
  touchEnd
} from './carousel.events'


// TODO: Add capability to link images,


const defaultConfig = {
  imagesPerSlide: 1,
  infiniteLoop: false,
  advanceSpeed: 500,
  mobileBreakpoint: 1023,
  showArrowsOnMobile: false,
  showArrowsOnDesktop: true,

  // Pass a glyph class to overide default arrows.
  leftArrowClass: 'g72-arrow-thin-left',
  rightArrowClass: 'g72-arrow-thin-right',

  // Accepts 'dot', 'text', or 'none'.
  slideIndicator: 'dot'
};

export default class GlamorousReactCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.config = Object.assign(defaultConfig, props.config || {});
    
    // Bind methods to instance where necessary.
    this.setPositions = setPositions.bind(this);
    this.animateCarousel = animateCarousel.bind(this);
    this.setPositionProps = setPositionProps.bind(this);
    this.loopImages = loopImages.bind(this);
    this.groupImages = groupImages.bind(this);
    this.setPositions = setPositions.bind(this);
    this.getCurrentSlide = getCurrentSlide.bind(this);
    this.click = click.bind(this);
    this.touchStart = touchStart.bind(this);
    this.touchMove = touchMove.bind(this);
    this.touchEnd = touchEnd.bind(this);

    // Set the initial state.
    this.state = {
      images: this.groupImages((props.images || []).slice()),
      currentSlide: 0,
      view: null,
      positions: null,
      isMobile: false,
      rightArrow: null,
      leftArrow: null
    }
  }

  get infinite() {
    return this.config.infiniteLoop;
  }

  get slideIndicatorStyle() {
    return (this.config.slideIndicator === 'dot') ? 'dot' : 
      (this.config.slideIndicator === 'text') ? 'text' : 
      null;
  }

  get slideCount() {
    if (this.state.images) {
      if (this.infinite) {
        return this.state.images.length / 2;
      }
      return this.state.images.length;
    }
    return 0;
  }

  componentDidMount() {
    this.setPositions();
    this.setState({view: this.view});
    window.addEventListener("resize", this.setPositions);
    window.addEventListener("orientationchange", this.setPositions);
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
        <Arrows
          containerStyle={returnArrowContainerStyle(this.state, this.config)}
          leftArrowStyle={returnArrowStyle(this.state, this.config, true)}
          rightArrowStyle={returnArrowStyle(this.state, this.config, false)}
          leftArrow={this.config.leftArrowClass}
          rightArrow={this.config.rightArrowClass}
          click={this.click}
        />
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
        : null}
        {
          this.slideIndicatorStyle ? 
            <SlideIndicator 
              type={this.slideIndicatorStyle} 
              count={this.slideCount} 
              current={this.state.currentSlide}
             /> 
          : null
        }
      </div>
    );
  }
}
