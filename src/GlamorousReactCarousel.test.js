

import React from 'react';
import GlamorousReactCarousel from './GlamorousReactCarousel';
import { slidesLight } from './data/testData';
import { config } from './data/testConfig';

describe('<GlamorousReactCarousel />', () => { 
  const carousel = mount(
    <GlamorousReactCarousel slides={slidesLight} config={config} />
  );

  test('component renders', () => {
    expect(carousel).toMatchSnapshot();
  });

  test('does not break', () => {
    const emptyCarousel = mount(<GlamorousReactCarousel />)
    expect(emptyCarousel).toMatchSnapshot();
  });

  test('init values return correctly', () => {
    const carouselClass = new GlamorousReactCarousel({config: config, slides: slidesLight});
    expect(carouselClass.slideCount).toEqual(6);
    expect(carouselClass.slideIndicatorStyle).toEqual('dot');

  });
});
