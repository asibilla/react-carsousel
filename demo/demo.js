import React from 'react';
import { GlamorousReactCarousel, GlamorousReactCarouselSlide } from '../index';
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
  imagesPerSlide: 1,
  infiniteLoop: true,
  advanceSpeed: 500,
  autoAdvance: true,
  autoAdvanceSpeed: 3000,
  rewind: false,
  mobileBreakpoint: 1023,
  showArrowsOnMobile: false,
  showArrowsOnDesktop: true,
  // Pass a glyph class to overide default arrows.
  leftArrowClass: 'g72-arrow-thin-left',
  rightArrowClass: 'g72-arrow-thin-right',
  // Accepts 'dot', 'text', or 'none'.
  slideIndicator: 'dot',
  // Accepts 'light' or 'dark'.
  theme: 'light'
};

export default class Demo extends React.Component {

  returnSlideArray() {
    let imgArray = [1, 2, 3, 4, 5, 6];
    return imgArray.map(num => 
      new GlamorousReactCarouselSlide(
        `./img/img_${num}.png`,
        `#${num}`,
        `Slide ${num}`,
        'fs16-sm fs18-lg',
        `This is some totally real, not at all fake text for slide ${num}`,
        'fs12-sm lh16-sm fs14-lg lh-16l text-color-grey'
      )
    );
  }

  render() {
    return (
      <div className={pageStyle}>
        <div className={`${container} ncss-brand`}>
           <GlamorousReactCarousel slides={this.returnSlideArray()} config={config}/>
        </div>
      </div>
    );
  }
}
