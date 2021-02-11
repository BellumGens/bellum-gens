import { browser, by, element } from 'protractor';

export class AppPage {
  public navigateTo() {
    return browser.get('/');
  }

  public getNavText() {
    return element(by.css('app-root h1')).getText();
  }

  public getWelcomeText() {
    return element(by.css('app-home h1')).getText();
  }
}
