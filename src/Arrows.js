import React from 'react';
import {
  arrowContainer, 
  arrowContainerLeft, 
  arrowContainerRight, 
  arrow
} from './glamorStyles';


export default class Arrows extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="arrows">
        <div className={`${arrowContainer} ${arrowContainerLeft}`} 
          style={this.props.containerStyle}
          onClick={e => {this.props.click(e, false)}}
        >
          <div className={`${this.props.leftArrow} ${arrow}`} style={this.props.leftArrowStyle}></div>
        </div>
        <div className={`${arrowContainer} ${arrowContainerRight}`} 
          style={this.props.containerStyle}
          onClick={e => {this.props.click(e, true)}}
        >
          <div className={`${this.props.rightArrow} ${arrow}`} style={this.propsRightArrowStle}></div>
        </div>
      </div>
    )
  }
}