import { StrategyEditor } from './strategy-editor';
import { ElementRef } from '@angular/core';
import { EditorLayer, EditorLayerType, FreeflowLayer } from './editor-layer';
import { STRAT_UTILITIES } from './utility';


describe('StrategyEditor', () => {
  let strategyEditor: StrategyEditor;
  let context: HTMLCanvasElement;
  let samples = STRAT_UTILITIES;

  beforeEach(() => {
    context = document.createElement('canvas');
    strategyEditor = new StrategyEditor(new ElementRef(context));
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
    const imageLayer = strategyEditor.createImageLayer();
    expect(imageLayer).toBeTruthy();
    strategyEditor.addLayer(imageLayer);
    expect(strategyEditor.layers.length).toBe(1);
    expect(strategyEditor.layers[0]).toBe(imageLayer);
  });

  it('should create a new freeflow layer', () => {
    const freeflowLayer = strategyEditor.createFreeflowLayer();
    expect(freeflowLayer).toBeTruthy();
    strategyEditor.addLayer(freeflowLayer);
    expect(strategyEditor.layers.length).toBe(1);
    expect(strategyEditor.layers[0]).toBe(freeflowLayer);
  });

  it('should remove a layer', () => {
    const layer = new FreeflowLayer(context, 'Freeflow Layer');
    strategyEditor.addLayer(layer);
    strategyEditor.removeLayer(layer);
    expect(strategyEditor.layers.length).toBe(0);
  });

  // Add more tests as needed
  it('should save and restore the editor state', () => {
    const metadata = strategyEditor.save();
    const imageLayer = strategyEditor.createImageLayer();
    strategyEditor.addLayer(imageLayer);
    strategyEditor.restore(metadata);
    expect(strategyEditor.layers.length).toBe(0);
  });

  it('should selected layer by coordinates', (done) => {
    const meta: EditorLayer = {
      name: samples[0].name,
      type: EditorLayerType.Image,
      x: 0,
      y: 0,
      width: samples[0].width,
      height: samples[0].height,
      movable: true,
      displayRatio: 1,
      src: samples[0].svg,
      circle: false
    };
    const imageLayer = strategyEditor.createImageLayer('Image Layer', meta);
    strategyEditor.addLayer(strategyEditor.createImageLayer('Background Image Layer'));
    strategyEditor.addLayer(imageLayer);
    imageLayer.layerSelect.subscribe((layer) => {
      expect(layer.selected).toBe(true);
      expect(imageLayer.selected).toBe(true);
      expect(strategyEditor['_selectedLayer']).toBe(imageLayer);
      done();
    });
    strategyEditor.trySelectLayer({ x: 10, y: 10 });
  });

  it('should move the selected layer', () => {
    const meta: EditorLayer = {
      name: samples[0].name,
      type: EditorLayerType.Image,
      x: 0,
      y: 0,
      width: samples[0].width,
      height: samples[0].height,
      movable: true,
      displayRatio: 1,
      src: samples[0].svg,
      circle: false
    };
    const imageLayer = strategyEditor.createImageLayer('Image Layer', meta);
    strategyEditor.addLayer(strategyEditor.createImageLayer('Background Image Layer'));
    strategyEditor.addLayer(imageLayer);
    strategyEditor.trySelectLayer({ x: 10, y: 10 });
    strategyEditor.moveSelected({ x: 100, y: 100 });
    expect(imageLayer.x).toEqual(100);
    expect(imageLayer.y).toEqual(100);
  });

  it('should insert a layer at a specific index', () => {
    const imageLayer1 = strategyEditor.createImageLayer();
    const imageLayer2 = strategyEditor.createImageLayer();
    strategyEditor.addLayer(imageLayer1)
    strategyEditor.insertLayer(0, imageLayer2);
    expect(strategyEditor.layers[0]).toBe(imageLayer2);
    expect(strategyEditor.layers[1]).toBe(imageLayer1);
  });

  it('should replace a layer at a specific index', () => {
    const imageLayer1 = strategyEditor.createImageLayer();
    const imageLayer2 = strategyEditor.createImageLayer();
    strategyEditor.addLayer(imageLayer1);
    strategyEditor.replaceLayer(0, imageLayer2);
    expect(strategyEditor.layers.length).toBe(1);
    expect(strategyEditor.layers[0]).toBe(imageLayer2);
  });

  it('should deselect all layers', () => {
    const meta: EditorLayer = {
      name: samples[0].name,
      type: EditorLayerType.Image,
      x: 0,
      y: 0,
      width: samples[0].width,
      height: samples[0].height,
      movable: true,
      displayRatio: 1,
      src: samples[0].svg,
      circle: false
    };
    const imageLayer = strategyEditor.createImageLayer('Image Layer', meta);
    strategyEditor.addLayer(strategyEditor.createImageLayer('Background Image Layer'));
    strategyEditor.addLayer(imageLayer);
    strategyEditor.trySelectLayer({ x: 0, y: 0 });
    expect(imageLayer.selected).toBe(true);
    strategyEditor.deselectAll();
    expect(imageLayer.selected).toBe(false);
    expect(strategyEditor['_selectedLayer']).toBe(null);
  });
});
