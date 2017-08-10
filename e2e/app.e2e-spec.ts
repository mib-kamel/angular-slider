import { AngularSliderPage } from './app.po';

describe('angular-slider App', function() {
  let page: AngularSliderPage;

  beforeEach(() => {
    page = new AngularSliderPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
