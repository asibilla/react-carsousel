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

let config = {
  infiniteLoop : false
};

export default class Demo extends React.Component {

  returnImageArray() {
    let imgArray = [1, 2, 3, 4, 5, 6];
    return imgArray.map(num => `./img/img_${num}.png`);
  }

  render() {
    return (
      <div className={pageStyle}>
        <div className={container}>
           <GlamorousReactCarousel images={this.returnImageArray()} config={config}/>
        </div>
      </div>
    );
  }
}
