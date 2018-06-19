import React from 'react';
import GlamorousReactCarousel from '../index';
import { css } from 'glamor';

const pageStyle = css({
  width: '100%',
  height: '100vh',
  margin: '0',
  padding: '0',
  fontFamily: 'sans-serif'
});

let container = css({
  width: '100%',
  maxWidth: '600px',
  margin: "0 auto"
});

export default class Demo extends React.Component {

  returnImageArray() {
    let imgArray = [1, 2, 3, 4, 5, 6]
    return imgArray.map(num => `./img/img_${num}.png`);
  }

  render() {
    return (
      <div className={pageStyle}>
        <h1>Title</h1>
        <div className={container}>
           <GlamorousReactCarousel images={this.returnImageArray()} />
        </div>
      </div>
    );
  }
}
