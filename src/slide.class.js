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
