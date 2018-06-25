import React from 'react';
import {
  indicatorContainer,
  indicatorDot
} from './glamorStyles';


export default class SlideIndicator extends React.Component {
  constructor(props) {
    super(props);
  }

  isActive(index) {
    return index === this.props.current;
  }

  getDotColor(index) {
    if (this.props.theme === 'dark') {
      return (!this.isActive(index)) ? 'bg-medium-grey' : 'bg-accent';
    }
    return (!this.isActive(index)) ? 'bg-light-grey' : 'bg-grey';
  }

  get activeTextColor() {
    return (this.props.theme === 'dark') ? 'text-color-accent' : 'text-color-dark-grey';
  }

  get inactiveTextColor() {
    return (this.props.theme === 'dark') ? 'text-color-white' : 'text-color-grey';
  }

  createDotHtml() {
    let dots = [];
    for (let i = 0; i < this.props.count; i++) {
      dots.push(<div key={i} className={`${indicatorDot} ${this.getDotColor(i)}`}></div>)
    }
    return dots;
  }

  numberToText(num) {
    let str = (num + 1).toString();
    if (str.length < 2) {
      str = '0' + str;
    }
    return str;
  }


  render() {
    return (
      <div className={indicatorContainer}>
        { 
          this.props.type === 'dot' ? 
            this.createDotHtml()
          : <div className={`fs12-sm ${this.activeTextColor}`}>
              {this.numberToText(this.props.current)}
              <span className={this.inactiveTextColor}> / {this.numberToText(this.props.count - 1)} </span>
            </div>
        }
      </div>
    )
  }
}