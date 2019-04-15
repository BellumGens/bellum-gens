import { StrategyEditor } from './strategy-editor';
import { ElementRef } from '@angular/core';

describe('StrategyEditor', () => {
  it('should create an instance', () => {
    expect(new StrategyEditor(new ElementRef(document.createElement('canvas')))).toBeTruthy();
  });
});
