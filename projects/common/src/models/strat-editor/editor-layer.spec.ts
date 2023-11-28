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

  it('should draw the image layer', (done) => {
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
    imageLayer.drawFinish.subscribe(() => {
      expect(context.drawImage).toHaveBeenCalled();
      done();
    });
    spyOn(context, 'drawImage');
    imageLayer.draw();
  });

  it('should begin and end circle', (done) => {
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
    imageLayer.drawFinish.subscribe(() => {
      expect(context.drawImage).toHaveBeenCalled();
      expect(context.arc).toHaveBeenCalledWith(meta.x + meta.width / 2, meta.y + meta.height / 2, meta.width / 2, 0, 2 * Math.PI, true);
      done();
    });
    spyOn(context, 'drawImage');
    spyOn(context, 'arc');
    imageLayer.draw();
  });

  it('should draw selected border', (done) => {
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
    imageLayer.drawFinish.subscribe(() => {
      expect(context.strokeStyle).toBe(imageLayer.selectedBorderColor);
      expect(context.lineWidth).toBe(imageLayer.selectedBorderWidth);
      expect(context.strokeRect).toHaveBeenCalledWith(meta.x, meta.y, meta.width, meta.height);
      done();
    });
    spyOn(context, 'strokeRect');
    imageLayer.draw();
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
    spyOn(context, 'beginPath');
    spyOn(context, 'moveTo');
    spyOn(context, 'lineTo');
    spyOn(context, 'stroke');
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
});
