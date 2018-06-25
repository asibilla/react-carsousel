

import React from 'react';
import GlamorousReactCarousel from './GlamorousReactCarousel';
import { slidesLight } from './data/testData';
import { config } from './data/testConfig';

test('component renders', () => {
  const carousel = shallow(
    <GlamorousReactCarousel slides={slidesLight} config={config} />
  );
  
  expect(carousel).toMatchSnapshot();
});
