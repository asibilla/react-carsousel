import React from 'react';
import { 
  view, 
  slide, 
  imageStyle, 
  arrowContainer, 
  arrowContainerLeft, 
  arrowContainerRight, 
  arrow } from './glamorStyles';
import {
  groupImages,
  loopImages,
  setPositions,
  animateCarousel,
  setPositionProps,
  returnArrowContainerStyle, 
  returnArrowStyle
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
  leftArrowClass: 'g72-arrow-thin-left',
  rightArrowClass: 'g72-arrow-thin-right'
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
    this.click = click.bind(this);
    this.touchStart = touchStart.bind(this);
    this.touchMove = touchMove.bind(this);
    this.touchEnd = touchEnd.bind(this);

    // Set the initial state.
    this.state = {
      images: this.groupImages((props.images || []).slice()),
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
        <div className={`${arrowContainer} ${arrowContainerLeft}`} 
          style={returnArrowContainerStyle(this.state, this.config)}
          onClick={e => {this.click(e, false)}}
        >
          <div className={`${this.config.leftArrowClass} ${arrow}`} style={returnArrowStyle(this.state, this.config, true)}></div>
        </div>
        <div className={`${arrowContainer} ${arrowContainerRight}`} 
          style={returnArrowContainerStyle(this.state, this.config)}
          onClick={e => {this.click(e, true)}}
        >
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
