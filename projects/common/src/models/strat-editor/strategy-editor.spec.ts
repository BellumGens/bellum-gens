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

  it('names the surface as asked, or with a random six character id', () => {
    expect(new StrategyEditor(new ElementRef(canvas), 1, 'board').surfaceName).toBe('board');
    expect(strategyEditor.surfaceName).toMatch(/^[A-Za-z0-9]{6}$/);
  });

  it('creates no layer for an unknown layer type', () => {
    expect(strategyEditor.createLayer(99, { name: 'unknown' } as EditorLayer)).toBeUndefined();
  });

  it('names new layers by their position when no name is given', () => {
    strategyEditor.addLayer(strategyEditor.createImageLayer());

    expect(strategyEditor.createImageLayer().name).toBe('Layer_2');
    expect(strategyEditor.createFreeflowLayer().name).toBe('Layer_2');
  });

  it('selects the topmost layer under the pointer, but never the background', () => {
    const meta = (x: number): EditorLayer => ({
      name: `at ${x}`, type: EditorLayerType.Image, x, y: 0, width: 20, height: 20, movable: true, displayRatio: 1
    });
    const background = strategyEditor.createImageLayer('Background', { ...meta(0), width: 1024, height: 1024 });
    const lower = strategyEditor.createImageLayer('Lower', meta(0));
    const upper = strategyEditor.createImageLayer('Upper', meta(100));
    [background, lower, upper].forEach(layer => strategyEditor.addLayer(layer));

    strategyEditor.trySelectLayer({ x: 10, y: 10 });
    expect(lower.selected).toBe(true);
    expect(upper.selected).toBe(false);

    strategyEditor.deselectAll();
    strategyEditor.trySelectLayer({ x: 500, y: 500 });
    expect(background.selected).toBe(false);
    expect(strategyEditor['_selectedLayer']).toBeNull();
  });

  it('does not move anything without a selection, nor a layer that is not movable', () => {
    const fixed = strategyEditor.createImageLayer('Fixed', {
      name: 'Fixed', type: EditorLayerType.Image, x: 5, y: 5, width: 20, height: 20, movable: false, displayRatio: 1
    });
    strategyEditor.addLayer(fixed);
    const flip = vi.spyOn(strategyEditor, 'flip').mockImplementation(() => undefined);

    strategyEditor.moveSelected({ x: 10, y: 10 });
    expect(flip).not.toHaveBeenCalled();

    fixed.selected = true;
    flip.mockClear();
    strategyEditor.moveSelected({ x: 10, y: 10 });

    expect([fixed.x, fixed.y]).toEqual([5, 5]);
    expect(flip).not.toHaveBeenCalled();
  });

  it('has nothing to deselect without a selection', () => {
    const flip = vi.spyOn(strategyEditor, 'flip');

    strategyEditor.deselectAll();

    expect(flip).not.toHaveBeenCalled();
  });

  it('keeps the selection when another layer is removed', () => {
    const selected = strategyEditor.createImageLayer('Selected');
    const other = strategyEditor.createImageLayer('Other');
    strategyEditor.addLayer(selected);
    strategyEditor.addLayer(other);
    selected.selected = true;

    strategyEditor.removeLayer(other);

    expect(strategyEditor.layers).toEqual([selected]);
    expect(strategyEditor['_selectedLayer']).toBe(selected);
  });

  it('stops listening to a removed or replaced layer, which stays usable', () => {
    const removed = strategyEditor.createImageLayer('Removed');
    const replaced = strategyEditor.createImageLayer('Replaced');
    const replacement = strategyEditor.createImageLayer('Replacement');
    [removed, replaced].forEach(layer => strategyEditor.addLayer(layer));
    strategyEditor.removeLayer(removed);
    strategyEditor.replaceLayer(0, replacement);
    const flip = vi.spyOn(strategyEditor, 'flip');

    expect(() => {
      removed.hidden = true;
      removed.selected = true;
      replaced.selected = true;
    }).not.toThrow();
    expect(flip).not.toHaveBeenCalled();
    expect(strategyEditor['_selectedLayer']).toBeUndefined();

    replacement.selected = true;
    expect(strategyEditor['_selectedLayer']).toBe(replacement);
  });

  it('keeps the selection when a layer it was not tracking is deselected', () => {
    const current = strategyEditor.createImageLayer('Current');
    const stale = strategyEditor.createImageLayer('Stale');
    // Selected before the editor was listening to it
    stale.selected = true;
    strategyEditor.addLayer(stale);
    strategyEditor.addLayer(current);
    current.selected = true;

    stale.selected = false;

    expect(strategyEditor['_selectedLayer']).toBe(current);
    expect(current.selected).toBe(true);
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
    expect(imageLayer2 instanceof ImageLayer).toBe(true);
    expect(imageLayer2).toBeTruthy();
    strategyEditor.addLayer(imageLayer2);
    expect(strategyEditor.layers.length).toBe(2);
    expect(strategyEditor.layers[1]).toBe(imageLayer2);
  });

  it('should create and add a new freeflow layer', () => {
    const freeflowLayer = strategyEditor.createFreeflowLayer();
    const spy = vi.spyOn(strategyEditor, 'flip').mockImplementation(() => undefined);
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
    const layer = new ImageLayer(canvas.getContext('2d'), 'Image Layer');
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
