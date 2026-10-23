import { ElementRef } from '@angular/core';
import { ImageLayer, FreeflowLayer, EditorLayerType, EditorLayer } from './editor-layer';
import { STRAT_UTILITIES } from './utility';


describe('ImageLayer', () => {
  let canvas: ElementRef;
  let context: any;
  let samples = STRAT_UTILITIES;

  beforeEach(() => {
    canvas = new ElementRef(document.createElement('canvas'));
    context = canvas.nativeElement.getContext('2d');
  });

  it('should create an instance', () => {
    const imageLayer = new ImageLayer(context, 'Layer');
    expect(imageLayer).toBeTruthy();
    expect(imageLayer instanceof ImageLayer).toBe(true);
    expect(imageLayer.type).toBe(EditorLayerType.Image);
  });

  it('should draw the image layer', async () => {
    let sample = samples[0];
    const meta: EditorLayer = {
      name: sample.name,
      type: EditorLayerType.Image,
      x: 0,
      y: 0,
      width: sample.width,
      height: sample.height,
      movable: true,
      displayRatio: 1,
      src: sample.svg,
      circle: false
    };
    const imageLayer = new ImageLayer(context, 'Layer', 1, meta);
    const drawFinished = new Promise<void>(resolve => imageLayer.drawFinish.subscribe(() => resolve()));
    vi.spyOn(context, 'drawImage').mockImplementation(() => undefined);
    imageLayer.draw();

    await drawFinished;

    expect(context.drawImage).toHaveBeenCalled();
  });

  it('should begin and end circle', async () => {
    let sample = samples[1];
    const meta: EditorLayer = {
      name: sample.name,
      type: EditorLayerType.Image,
      x: 0,
      y: 0,
      width: sample.width,
      height: sample.height,
      movable: true,
      displayRatio: 1,
      src: sample.svg,
      circle: true
    };
    const imageLayer = new ImageLayer(context, 'Layer', 1, meta);
    const drawFinished = new Promise<void>(resolve => imageLayer.drawFinish.subscribe(() => resolve()));
    vi.spyOn(context, 'drawImage').mockImplementation(() => undefined);
    vi.spyOn(context, 'arc').mockImplementation(() => undefined);
    imageLayer.draw();

    await drawFinished;

    expect(context.drawImage).toHaveBeenCalled();
    expect(context.arc).toHaveBeenCalledWith(meta.x + meta.width / 2, meta.y + meta.height / 2, meta.width / 2, 0, 2 * Math.PI, true);
  });

  it('should draw selected border', async () => {
    let sample = samples[0];
    const meta: EditorLayer = {
      name: sample.name,
      type: EditorLayerType.Image,
      x: 0,
      y: 0,
      width: sample.width,
      height: sample.height,
      movable: true,
      displayRatio: 1,
      src: sample.svg,
      circle: true
    };
    const imageLayer = new ImageLayer(context, 'Layer', 1, meta);
    imageLayer.selected = true;
    const drawFinished = new Promise<void>(resolve => imageLayer.drawFinish.subscribe(() => resolve()));
    vi.spyOn(context, 'strokeRect').mockImplementation(() => undefined);
    imageLayer.draw();

    await drawFinished;

    expect(context.strokeStyle).toBe(imageLayer.selectedBorderColor);
    expect(context.lineWidth).toBe(imageLayer.selectedBorderWidth);
    expect(context.strokeRect).toHaveBeenCalledWith(meta.x, meta.y, meta.width, meta.height);
  });

  it('redraws from the loaded image, clipped to a circle and bordered while selected', async () => {
    const meta: EditorLayer = {
      name: 'avatar', type: EditorLayerType.Image, x: 10, y: 20, width: 24, height: 24,
      movable: true, displayRatio: 1, src: samples[0].svg, circle: true
    };
    const imageLayer = new ImageLayer(context, 'Layer', 1, meta);
    const firstDraw = new Promise<void>(resolve => imageLayer.drawFinish.subscribe(() => resolve()));
    imageLayer.draw();
    await firstDraw;
    const image = imageLayer.image;
    const drawImage = vi.spyOn(context, 'drawImage');
    const arc = vi.spyOn(context, 'arc');
    const restore = vi.spyOn(context, 'restore');
    const strokeRect = vi.spyOn(context, 'strokeRect');
    const finished = vi.fn();
    imageLayer.drawFinish.subscribe(finished);
    imageLayer.selected = true;

    imageLayer.draw();

    // The second draw is synchronous and does not load the image again
    expect(imageLayer.image).toBe(image);
    expect(strokeRect).toHaveBeenCalledWith(10, 20, 24, 24);
    expect(arc).toHaveBeenCalledWith(22, 32, 12, 0, 2 * Math.PI, true);
    expect(drawImage).toHaveBeenCalledWith(image, 10, 20, 24, 24);
    expect(restore).toHaveBeenCalled();
    expect(finished).toHaveBeenCalledTimes(1);
  });

  it('redraws a square image without clipping or a border', async () => {
    const imageLayer = new ImageLayer(context, 'Layer', 1, {
      name: 'smoke', type: EditorLayerType.Image, x: 0, y: 0, width: 72, height: 72,
      movable: true, displayRatio: 1, src: samples[0].svg, circle: false
    });
    const firstDraw = new Promise<void>(resolve => imageLayer.drawFinish.subscribe(() => resolve()));
    imageLayer.draw();
    await firstDraw;
    const arc = vi.spyOn(context, 'arc');
    const strokeRect = vi.spyOn(context, 'strokeRect');
    const drawImage = vi.spyOn(context, 'drawImage');

    imageLayer.draw();

    expect(drawImage).toHaveBeenCalledTimes(1);
    expect(arc).not.toHaveBeenCalled();
    expect(strokeRect).not.toHaveBeenCalled();
  });

  it('skips drawing a hidden layer but still reports the draw as finished', () => {
    const imageLayer = new ImageLayer(context, 'Layer');
    const updated = vi.fn();
    const finished = vi.fn();
    imageLayer.layerUpdate.subscribe(updated);
    imageLayer.drawFinish.subscribe(finished);
    const drawImage = vi.spyOn(context, 'drawImage');

    imageLayer.hidden = true;
    imageLayer.draw();

    expect(updated).toHaveBeenCalledWith(imageLayer);
    expect(imageLayer.image).toBeUndefined();
    expect(drawImage).not.toHaveBeenCalled();
    expect(finished).toHaveBeenCalledTimes(1);
  });

  it('scales a layer saved at another display ratio to the current one', () => {
    const imageLayer = new ImageLayer(context, 'Layer', 0.5, {
      name: 't', type: EditorLayerType.Image, x: 101, y: 200, width: 24, height: 24, movable: true, displayRatio: 1
    });

    expect([imageLayer.x, imageLayer.y]).toEqual([51, 100]);
    // The size stays in board units, the ratio is applied when drawing
    expect([imageLayer.width, imageLayer.height]).toEqual([24, 24]);
  });

  it('is selected only by a point within its bounds', () => {
    const imageLayer = new ImageLayer(context, 'Layer', 1, {
      name: 't', type: EditorLayerType.Image, x: 10, y: 10, width: 20, height: 20, movable: true, displayRatio: 1
    });
    const selections = [];
    imageLayer.layerSelect.subscribe(selection => selections.push(selection.selected));

    expect(imageLayer.trySelect({ x: 5, y: 15 })).toBe(false);
    expect(imageLayer.trySelect({ x: 15, y: 31 })).toBe(false);
    expect(imageLayer.selected).toBe(false);

    expect(imageLayer.trySelect({ x: 30, y: 30 })).toBe(true);
    expect(imageLayer.selected).toBe(true);

    // Selecting an already selected layer does not report it again
    imageLayer.selected = true;
    expect(selections).toEqual([true]);
  });

  it('cannot be selected when it is not selectable', () => {
    const imageLayer = new ImageLayer(context, 'Layer', 1, {
      name: 't', type: EditorLayerType.Image, x: 0, y: 0, width: 20, height: 20, movable: true, displayRatio: 1
    });
    imageLayer.selectable = false;

    expect(imageLayer.trySelect({ x: 10, y: 10 })).toBe(false);
    imageLayer.selected = true;
    expect(imageLayer.selected).toBe(false);
  });
});

describe('FreeflowLayer', () => {
  let canvas: ElementRef;
  let context: any;

  beforeEach(() => {
    canvas = new ElementRef(document.createElement('canvas'));
    context = canvas.nativeElement.getContext('2d');
  });

  it('should create an instance', () => {
    const freeflowLayer = new FreeflowLayer(context, 'Layer');
    expect(freeflowLayer).toBeTruthy();
    expect(freeflowLayer instanceof FreeflowLayer).toBe(true);
    expect(freeflowLayer.type).toBe(EditorLayerType.Freeflow);
  });

  it('should create a path', () => {
    const freeflowLayer = new FreeflowLayer(context, 'Layer');
    freeflowLayer.createPath();
    expect(freeflowLayer.paths.length).toBe(1);
    expect(freeflowLayer.paths[0].points.length).toBe(0);
  });

  it('should add a point to the current path', () => {
    const freeflowLayer = new FreeflowLayer(context, 'Layer');
    freeflowLayer.createPath();
    freeflowLayer.addPoint({ x: 10, y: 20 });
    expect(freeflowLayer.paths[0].points.length).toBe(1);
    expect(freeflowLayer.paths[0].points[0]).toEqual({ x: 10, y: 20 });
  });

  it('should close the current path', () => {
    const freeflowLayer = new FreeflowLayer(context, 'Layer');
    freeflowLayer.createPath();
    freeflowLayer.addPoint({ x: 10, y: 20 });
    freeflowLayer.closePath();
    expect(freeflowLayer.paths[0].points.length).toBe(1);
    expect(freeflowLayer.paths[0].points[0]).toEqual({ x: 10, y: 20 });
  });

  it('should draw the freeflow layer', () => {
    const freeflowLayer = new FreeflowLayer(context, 'Layer');
    vi.spyOn(context, 'beginPath').mockImplementation(() => undefined);
    vi.spyOn(context, 'moveTo').mockImplementation(() => undefined);
    vi.spyOn(context, 'lineTo').mockImplementation(() => undefined);
    vi.spyOn(context, 'stroke').mockImplementation(() => undefined);
    freeflowLayer.createPath();
    freeflowLayer.addPoint({ x: 10, y: 20 });
    freeflowLayer.addPoint({ x: 30, y: 40 });
    freeflowLayer.draw();
    expect(context.beginPath).toHaveBeenCalled();
    expect(context.moveTo).toHaveBeenCalledTimes(1);
    expect(context.lineTo).toHaveBeenCalledTimes(1);
    expect(context.strokeStyle).toBe(freeflowLayer.color);
    expect(context.lineWidth).toBe(5);
    expect(context.stroke).toHaveBeenCalled();
  });

  it('should optimize the paths based on slope', () => {
    const freeflowLayer = new FreeflowLayer(context, 'Layer');
    freeflowLayer.createPath();
    freeflowLayer.addPoint({ x: 10, y: 20 });
    freeflowLayer.addPoint({ x: 30, y: 40 });
    freeflowLayer.addPoint({ x: 50, y: 60 });
    freeflowLayer.addPoint({ x: 70, y: 80 });
    freeflowLayer.addPoint({ x: 68, y: 76 });
    freeflowLayer.closePath();
    expect(freeflowLayer.paths.length).toBe(1);
    expect(freeflowLayer.paths[0].points.length).toBe(3);
  });

  it('scales the paths saved at another display ratio to the current one', () => {
    const freeflowLayer = new FreeflowLayer(context, 'Layer', 2, {
      name: 'drawing', type: EditorLayerType.Freeflow, x: 0, y: 0, width: 0, height: 0, displayRatio: 1, color: '#5889ff',
      paths: [{ points: [{ x: 10, y: 15 }, { x: 21, y: 30 }] }, { points: [{ x: 1, y: 2 }] }]
    });

    expect(freeflowLayer.paths).toEqual([{ points: [{ x: 20, y: 30 }, { x: 42, y: 60 }] }, { points: [{ x: 2, y: 4 }] }]);
    expect(freeflowLayer.color).toBe('#5889ff');
    expect(freeflowLayer.movable).toBe(false);
  });

  it('keeps the paths saved at the current display ratio', () => {
    const freeflowLayer = new FreeflowLayer(context, 'Layer', 1, {
      name: 'drawing', type: EditorLayerType.Freeflow, x: 0, y: 0, width: 0, height: 0, displayRatio: 1, color: '#fff100',
      paths: [{ points: [{ x: 10, y: 15 }, { x: 21, y: 30 }] }]
    });

    expect(freeflowLayer.paths).toEqual([{ points: [{ x: 10, y: 15 }, { x: 21, y: 30 }] }]);
  });

  it('can never be selected', () => {
    const freeflowLayer = new FreeflowLayer(context, 'Layer');

    expect(freeflowLayer.trySelect({ x: 0, y: 0 })).toBe(false);
    expect(freeflowLayer.selected).toBe(false);
  });

  it('ignores closing a path that was never started', () => {
    const freeflowLayer = new FreeflowLayer(context, 'Layer');

    freeflowLayer.closePath();

    expect(freeflowLayer.paths).toEqual([]);
  });

  it('draws nothing while hidden, nor for a single point path, but reports the draw as finished', () => {
    const freeflowLayer = new FreeflowLayer(context, 'Layer');
    const stroke = vi.spyOn(context, 'stroke');
    const finished = vi.fn();
    freeflowLayer.drawFinish.subscribe(finished);
    freeflowLayer.createPath();
    freeflowLayer.addPoint({ x: 1, y: 1 });

    freeflowLayer.draw();
    expect(stroke).not.toHaveBeenCalled();

    freeflowLayer.addPoint({ x: 5, y: 5 });
    freeflowLayer.hidden = true;
    freeflowLayer.draw();

    expect(stroke).not.toHaveBeenCalled();
    expect(finished).toHaveBeenCalledTimes(2);
  });
});
