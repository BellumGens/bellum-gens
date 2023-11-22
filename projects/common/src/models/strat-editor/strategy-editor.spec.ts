import { StrategyEditor } from './strategy-editor';
import { ElementRef } from '@angular/core';
import { FreeflowLayer } from './editor-layer';


describe('StrategyEditor', () => {
  let strategyEditor: StrategyEditor;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    strategyEditor = new StrategyEditor(new ElementRef(canvas));
  });

  it('should create an instance', () => {
    expect(strategyEditor).toBeTruthy();
  });

  it('should have default width and height', () => {
    expect(strategyEditor['_width']).toBe(1024);
    expect(strategyEditor['_height']).toBe(1024);
  });

  it('should have an empty layers array', () => {
    expect(strategyEditor.layers.length).toBe(0);
  });

  it('should create and add new image layer', () => {
    const imageLayer = strategyEditor.createImageLayer('Image Layer');
    expect(imageLayer).toBeTruthy();
    strategyEditor.addLayer(imageLayer);
    expect(strategyEditor.layers.length).toBe(1);
    expect(strategyEditor.layers[0]).toBe(imageLayer);
  });

  it('should create a new freeflow layer', () => {
    const freeflowLayer = strategyEditor.createFreeflowLayer('Freeflow Layer');
    expect(freeflowLayer).toBeTruthy();
    strategyEditor.addLayer(freeflowLayer);
    expect(strategyEditor.layers.length).toBe(1);
    expect(strategyEditor.layers[0]).toBe(freeflowLayer);
  });

  it('should remove a layer', () => {
    const layer = new FreeflowLayer(canvas, 'Freeflow Layer');
    strategyEditor.addLayer(layer);
    strategyEditor.removeLayer(layer);
    expect(strategyEditor.layers.length).toBe(0);
  });

  // Add more tests as needed

});
