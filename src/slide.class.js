/**
 * @param {string} image src for slide img tag
 * @param {string} link url to link to when user clicks on slide
 * @param {string} header h1 tag text below image
 * @param {string} headerClass css class to apply to h1 tag
 * @param {string} text text to display in p tag below header
 * @param {string} textClass css class to appy to p tag
 * 
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
