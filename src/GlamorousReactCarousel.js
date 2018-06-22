import React from 'react';
import Slides from './Slides';
import SlideIndicator from './SlideIndicator';
import Arrows from './Arrows';
import { view } from './glamorStyles';
import {
  groupSlides,
  loopSlides,
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
  infiniteLoop: true,
  advanceSpeed: 500,
  mobileBreakpoint: 1023,
  showArrowsOnMobile: false,
  showArrowsOnDesktop: true,
  // Pass a glyph class to overide default arrows.
  leftArrowClass: 'g72-arrow-thin-left',
  rightArrowClass: 'g72-arrow-thin-right',
  // Accepts 'dot', 'text', or 'none'.
  slideIndicator: 'dot',
  // Accepts 'light' or 'dark'.
  theme: 'light'
};

export default class GlamorousReactCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.config = Object.assign(defaultConfig, props.config || {});
    
    // Bind methods to instance where necessary.
    this.setPositions = setPositions.bind(this);
    this.animateCarousel = animateCarousel.bind(this);
    this.setPositionProps = setPositionProps.bind(this);
    this.loopSlides = loopSlides.bind(this);
    this.groupSlides = groupSlides.bind(this);
    this.setPositions = setPositions.bind(this);
    this.getCurrentSlide = getCurrentSlide.bind(this);
    this.click = click.bind(this);
    this.touchStart = touchStart.bind(this);
    this.touchMove = touchMove.bind(this);
    this.touchEnd = touchEnd.bind(this);

    // Set the initial state.
    this.state = {
      slides: this.groupSlides((props.slides || []).slice()),
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
    if (this.state.slides) {
      if (this.infinite) {
        return this.state.slides.length / 2;
      }
      return this.state.slides.length;
    }
    return 0;
  }

  get slideWidthStyle() {
    return {
      display: 'inline-block',
      width: `${100 / this.config.imagesPerSlide}%`
    };
  }

  get viewStyle() {
    return (this.config.theme === 'dark') ? 'bg-dark-grey' : 'bg-white';
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
        className={`${view} ${this.viewStyle}`} 
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
          theme={this.config.theme}
        />
        { (this.state.view && this.state.positions) ?
          <Slides 
            slides={this.state.slides} 
            position={this.state.positions.getPositionStyle()} 
            width={this.slideWidthStyle}
            theme={this.config.theme}
          />
        : null}
        {
          this.slideIndicatorStyle ? 
            <SlideIndicator 
              type={this.slideIndicatorStyle} 
              count={this.slideCount} 
              current={this.state.currentSlide}
              theme={this.config.theme}
             /> 
          : null
        }
      </div>
    );
  }
}
