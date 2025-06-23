import { SafeVideoLinkPipe } from './safe-video-link.pipe';
import { TestBed, inject } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

describe('SafeVideoLinkPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    });
  });

  it('create an instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new SafeVideoLinkPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  }));
});
