/**
 * This class is a model for the object array expected
 * by the carousel's 'slide' prop. It is not necessary to import this
 * class to instantiate the carousel, but the carousel's
 * 'slide' prop should be passed an object that adheres to 
 * this model.
 */

export default class GlamorousReactCarouselSlide {
  constructor(
    image = null,
    link = null,
    header = '',
    headerClass = '',
    text = '',
    textClass = ''
  ) {
    this.image = image;
    this.link = link;
    this.header = header;
    this.headerClass = headerClass;
    this.text = text;
    this.textClass = textClass;
  }
}
