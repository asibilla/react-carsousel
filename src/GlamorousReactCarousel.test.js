

import React from 'react';
import GlamorousReactCarousel from './GlamorousReactCarousel';
import { slidesLight } from './data/testData';
import { config1, config2, config3 } from './data/testConfig';

describe('<GlamorousReactCarousel />', () => { 

  test('component renders with default config', () => {
    const carousel = mount(
      <GlamorousReactCarousel slides={slidesLight} />
    );
    expect(carousel).toMatchSnapshot();
  });

  test('component renders with default config', () => {
    const carousel = mount(
      <GlamorousReactCarousel slides={slidesLight} config={config1} />
    );
    expect(carousel).toMatchSnapshot();
  });

  test('component renders with alternate slide indicators and theme', () => {
    const carousel = mount(
      <GlamorousReactCarousel slides={slidesLight} config={config2} />
    );
    expect(carousel).toMatchSnapshot();
  });

  test('component renders with multiple tiles per slide', () => {
    const carousel = mount(
      <GlamorousReactCarousel slides={slidesLight} config={config3} />
    );
    expect(carousel).toMatchSnapshot();
  });

  test('does not break if no slides', () => {
    const emptyCarousel = mount(<GlamorousReactCarousel />)
    expect(emptyCarousel).toMatchSnapshot();
  });

  test('init values return correctly', () => {
    const carouselClass = new GlamorousReactCarousel({config: config1, slides: slidesLight});
    expect(carouselClass.slideCount).toEqual(6);
    expect(carouselClass.slideIndicatorStyle).toEqual('dot');

  });
});
