
export function returnArrowContainerStyle(state, config) {
  if ((!state.isMobile && !config.showArrowsOnDesktop) || (state.isMobile && !config.showArrowsOnMobile)) {
    return {display: 'none'};
  }
  return {};
}

export function returnArrowStyle(state, config, left = false) {
  if (state.positions && !config.infiniteLoop) {
    let inactive = {opacity: '0.3'};
    if (state.positions.currentPosition >= 0 && left) {
      return inactive;
    }
    let rightEdge = (state.images.length * state.positions.width - state.positions.width) * -1;
    if (state.positions.currentPosition <= rightEdge && !left) {
      return inactive;
    }
  }
  return {};
}
