import React from 'react';
import { view, slides, slide } from './glamorStyles';


const defaultConfig = {
  imagesPerSlide: 1
};

export default class GlamorousReactCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.config = Object.assign(defaultConfig, props.config || {});
    this.groupImages((props.images || []).slice());
  }

  groupImages(images) {
    this.images = [];
    while (images.length) {
      this.images.push(images.splice(0, this.config.imagesPerSlide));
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className={view}>
        <div className={slides}>
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
