import React from 'react';
import {
  slide, 
  imageStyle,
  slideText,
  slideHeader
} from './glamorStyles';


export default class Slides extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="slides" style={this.props.position}>
        { 
          this.props.slides.map((slideGroup, index) => 
            <div className={slide} key={`slidegroup${index}`}>
              {
                slideGroup.map((slide, childIndex) => 
                  <div key={`slide${childIndex}`} onClick={() => window.location.href = slide.link} style={this.props.width}>
                    { 
                      slide.image ? 
                        <img className={imageStyle} src={slide.image} />
                      : null
                    }
                    <div className={`${slideText}`}>
                      <h1 className={`${slide.headerClass} ${slideHeader}`}>{slide.header}</h1>
                      <p className={slide.textClass}>{slide.text}</p>
                    </div>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    )
  }
}