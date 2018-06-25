import React from 'react';
import {
  arrowContainer, 
  arrowContainerLeft, 
  arrowContainerRight, 
  arrow
} from '../styles/glamorStyles';


export default class Arrows extends React.Component {
  constructor(props) {
    super(props);
  }

  get arrowColor() {
    return this.props.theme === 'dark' ? 'text-color-accent' : 'text-color-black';
  }

  render() {
    return (
      <div className="arrows">
        <div className={`${arrowContainer} ${arrowContainerLeft}`} 
          style={this.props.containerStyle}
          onClick={e => {this.props.click(e, false)}}
        >
          <div className={`${this.props.leftArrow} ${arrow} ${this.arrowColor}`} style={this.props.leftArrowStyle}></div>
        </div>
        <div className={`${arrowContainer} ${arrowContainerRight}`} 
          style={this.props.containerStyle}
          onClick={e => {this.props.click(e, true)}}
        >
          <div className={`${this.props.rightArrow} ${arrow} ${this.arrowColor}`} style={this.props.rightArrowStyle}></div>
        </div>
      </div>
    )
  }
}