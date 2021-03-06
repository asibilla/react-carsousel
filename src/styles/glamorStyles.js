import { css } from 'glamor';

export const view = css({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap'
});

export const slide = css({
  width: '100%',
  display: 'inline-block',
  textAlign: 'center',
  verticalAlign: 'top'
});

export const slidesInner = css({
  height: '100%',
  margin: '15px 30px',
  padding: '15px',
  borderRadius: '10px'
});

export const slideText = css({
  whiteSpace: 'normal'
});

export const slideHeader = css({
  textTransform: 'uppercase'
});

export const imageStyle = css({
  display: 'inline-block',
  maxWidth: '100%'
});

export const arrowContainer = css({
  position: 'absolute',
  width: '30px',
  height: '100%',
  top: '0',
  cursor: 'pointer',
  zIndex: '1'
});

export const arrowContainerLeft = css({
  left: '0'
});

export const arrowContainerRight = css({
  right: '0'
});

export const arrow = css({
  position: 'absolute',
  top: '50%',
  left: '50%',
  fontSize: '30px',
  transform: 'translate(-50%, -50%)',
});

export const indicatorContainer = css({
  width: '100%',
  textAlign: 'center'
});

export const indicatorDot = css({
  display: 'inline-block',
  width: '6px',
  height: '6px',
  margin: '4px',
  borderRadius: '50%'
});
