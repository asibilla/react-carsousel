import React from 'react';
import { view, slides, slide } from './glamorStyles';


const defaultConfig = {
  imagesPerSlide: 1,
  infiniteLoop: false,
};

export default class GlamorousReactCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.config = Object.assign(defaultConfig, props.config || {});
    
    this.state = {
      position: this.defaultPosition,
      startPosition: this.defaultPosition,
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      startTime: 0
    };

    this.groupImages((props.images || []).slice());

    if (this.infinite) {
      this.loopImages(false);
    }
  }

  get infinite() {
    return this.config.infiniteLoop;
  }

  get defaultPosition() {
    return this.infinite ? -100 : 0;
  }

  getPositionStyle(pos) {
    return {
      transform: `translate(${pos}%)`
    }
  }

  groupImages(images) {
    this.images = [];
    while (images.length) {
      this.images.push(images.splice(0, this.config.imagesPerSlide));
    }
  }

  loopImages(advance = true) {
    if (advance) {
      // Remove first item from array and move to last position.
      this.images.push(this.images.splice(0, 1));
    }
    else {
      // Remove last item from array and move to first position.
      this.images.unshift(this.images.splice(this.images.length - 1, 1));
    }
  }

  componentDidMount() {

  }

  touchstart(event) {
    console.log('the carousel was touched', event.nativeEvent);
    console.log(this);
  }

  render() {
    return (
      <div className={view} onTouchStart={e => this.touchstart(e)}>
        <div className={slides} style={this.getPositionStyle(this.position)}>
        { 
          this.images.map((imageGroup, index) => 
            <div className={slide} key={`imagegroup${index}`}>
              {
                imageGroup.map((image, childIndex) => 
                  <div key={`image${childIndex}`}>
                    <img src={image} />
                  </div>
                )
              }
            </div>
          )
        }
        </div>
      </div>
    );
  }
}
