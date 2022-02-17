import { ImageLayer, FreeflowLayer } from './editor-layer';
import { ElementRef } from '@angular/core';

describe('EditorLayer', () => {
  it('should create an instance', () => {
    const canvas = new ElementRef(document.createElement('canvas'));
    expect(new ImageLayer(canvas.nativeElement.getContext('2d'), 'Layer')).toBeTruthy();
    expect(new FreeflowLayer(canvas.nativeElement.getContext('2d'), 'Layer')).toBeTruthy();
  });
});
