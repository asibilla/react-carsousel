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
    if (index === this.props.current) {
      return {backgroundColor: '#6d6d6d'};
    }
    return {};
  }

  createDotHtml() {
    let dots = [];
    for (let i = 0; i < this.props.count; i++) {
      dots.push(<div key={i} className={indicatorDot} style={this.isActive(i)}></div>)
    }
    return dots;
  }

  render() {
    return (
      <div className={indicatorContainer}>
        { 
          this.props.type === 'dot' ? 
            this.createDotHtml()
          : <div></div>

        }
      </div>
    )
  }
}