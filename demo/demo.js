import React from 'react';
import { GlamorousReactCarousel } from '../index';
import { slidesLight, slidesDark, noImages } from '../src/data/testData';
import { css } from 'glamor';

const pageStyle = css({
  width: '100%',
  height: '100vh',
  margin: '0',
  padding: '0',
  fontFamily: 'sans-serif'
});

const container = css({
  width: '100%',
  maxWidth: '600px',
  margin: "0 auto"
});

const config = {
  advanceSpeed: 300,
  autoAdvance: false,
  autoAdvanceSpeed: 4000,
  imagesPerSlide: 1,
  infiniteLoop: true,
  leftArrowClass: 'g72-arrow-thin-left',
  mobileBreakpoint: 1023,
  showArrowsOnMobile: false,
  showArrowsOnDesktop: true,
  rightArrowClass: 'g72-arrow-thin-right',
  rewind: false,
  slideIndicator: 'dot',
  theme: 'light'
};

//g72-arrow-fill-left
//g72-arrow-fill-right

export default class Demo extends React.Component {

  returnSlideArray() {
    return (config.theme === 'dark') ? slidesDark : slidesLight;
  }

  pageBackgroundClass() {
    return (config.theme === 'dark') ? 'bg-dark-grey' : 'bg-white';
  }

  render() {
    return (
      <div className={`${pageStyle} ${this.pageBackgroundClass()}`}>
        <div className={`${container} ncss-brand`}>
           <GlamorousReactCarousel slides={this.returnSlideArray()} config={config}/>
        </div>
      </div>
    );
  }
}
