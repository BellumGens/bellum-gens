import { StrategyEditor } from './strategy-editor';
import { ElementRef } from '@angular/core';
import { EditorLayer, EditorLayerType, FreeflowLayer, ImageLayer } from './editor-layer';
import { STRAT_UTILITIES } from './utility';


describe('StrategyEditor', () => {
  let strategyEditor: StrategyEditor;
  let canvas: HTMLCanvasElement;
  let samples = STRAT_UTILITIES;

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
    const imageLayer = strategyEditor.createImageLayer();
    expect(imageLayer).toBeTruthy();
    strategyEditor.addLayer(imageLayer);
    expect(strategyEditor.layers.length).toBe(1);
    expect(strategyEditor.layers[0]).toBe(imageLayer);
    const meta: EditorLayer = {
      name: samples[0].name,
      type: EditorLayerType.Image,
      x: 0,
      y: 0,
      width: samples[0].width,
      height: samples[0].height,
      movable: true,
      displayRatio: 1,
      circle: false
    };
    const imageLayer2 = strategyEditor.createLayer(EditorLayerType.Image, meta);
    expect(imageLayer2 instanceof ImageLayer).toBeTrue();
    expect(imageLayer2).toBeTruthy();
    strategyEditor.addLayer(imageLayer2);
    expect(strategyEditor.layers.length).toBe(2);
    expect(strategyEditor.layers[1]).toBe(imageLayer2);
  });

  it('should create and add a new freeflow layer', () => {
    const freeflowLayer = strategyEditor.createFreeflowLayer();
    const spy = spyOn(strategyEditor, 'flip');
    expect(freeflowLayer).toBeTruthy();
    strategyEditor.addLayer(freeflowLayer);
    expect(spy).toHaveBeenCalled();
    expect(strategyEditor.layers.length).toBe(1);
    expect(strategyEditor.layers[0]).toBe(freeflowLayer);
    const meta: EditorLayer = {
      name: samples[1].name,
      type: EditorLayerType.Freeflow,
      x: 0,
      y: 0,
      width: samples[0].width,
      height: samples[0].height,
      movable: false,
      displayRatio: 1,
      circle: false
    };
    const freeflowLayer2 = strategyEditor.createLayer(EditorLayerType.Freeflow, meta);
    expect(freeflowLayer2 instanceof FreeflowLayer).toBeTruthy();
    strategyEditor.addLayer(freeflowLayer2);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(strategyEditor.layers.length).toBe(2);
    expect(strategyEditor.layers[1]).toBe(freeflowLayer2);
  });

  it('should remove a layer', () => {
    const layer = new FreeflowLayer(canvas.getContext('2d'), 'Freeflow Layer');
    strategyEditor.addLayer(layer);
    layer.selected = true;
    expect(strategyEditor['_selectedLayer']).toBe(layer);
    strategyEditor.removeLayer(layer);
    expect(strategyEditor.layers.length).toBe(0);
    expect(strategyEditor['_selectedLayer']).toBe(null);
  });

  // Add more tests as needed
  it('should save and restore the editor state', () => {
    const metadata = strategyEditor.save();
    const imageLayer = strategyEditor.createImageLayer();
    strategyEditor.addLayer(imageLayer);
    const metadata2 = strategyEditor.save();
    strategyEditor.restore(metadata);
    expect(strategyEditor.layers.length).toBe(0);
    strategyEditor.restore(metadata2);
    expect(strategyEditor.layers.length).toBe(1);
  });

  it('should selected layer by coordinates', () => {
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
    expect(imageLayer.selected).toBe(true);
    expect(strategyEditor['_selectedLayer']).toBe(imageLayer);
    meta.x = meta.y = 100;
    const imageLayer2 = strategyEditor.createImageLayer('Image Layer 2', meta);
    strategyEditor.addLayer(imageLayer2);
    strategyEditor.trySelectLayer({ x: 110, y: 110 });
    expect(imageLayer.selected).toBe(false);
    expect(imageLayer2.selected).toBe(true);
    expect(strategyEditor['_selectedLayer']).toBe(imageLayer2);
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

  it('should insert a layer at a specific index or add the layer', () => {
    const imageLayer1 = strategyEditor.createImageLayer();
    const imageLayer2 = strategyEditor.createImageLayer();
    strategyEditor.addLayer(imageLayer1)
    strategyEditor.insertLayer(0, imageLayer2);
    expect(strategyEditor.layers[0]).toBe(imageLayer2);
    expect(strategyEditor.layers[1]).toBe(imageLayer1);
    const freeflowLayer = strategyEditor.createFreeflowLayer();
    strategyEditor.insertLayer(2, freeflowLayer);
    expect(strategyEditor.layers.length).toBe(3);
    expect(strategyEditor.layers[2]).toBe(freeflowLayer);
  });

  it('should replace a layer at a specific index or add the layer', () => {
    const imageLayer1 = strategyEditor.createImageLayer();
    const imageLayer2 = strategyEditor.createImageLayer();
    strategyEditor.addLayer(imageLayer1);
    strategyEditor.replaceLayer(0, imageLayer2);
    expect(strategyEditor.layers.length).toBe(1);
    expect(strategyEditor.layers[0]).toBe(imageLayer2);
    const freeflowLayer = strategyEditor.createFreeflowLayer();
    strategyEditor.replaceLayer(1, freeflowLayer);
    expect(strategyEditor.layers.length).toBe(2);
    expect(strategyEditor.layers[1]).toBe(freeflowLayer);
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
    expect(strategyEditor['_selectedLayer']).toBe(imageLayer);
    strategyEditor.deselectAll();
    expect(imageLayer.selected).toBe(false);
    expect(strategyEditor['_selectedLayer']).toBe(null);
  });
});
