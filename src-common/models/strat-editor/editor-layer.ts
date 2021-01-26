import { EventEmitter } from '@angular/core';

export interface EditorLayer {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: EditorLayerType;
  displayRatio: number;
  circle?: boolean;
  src?: string;
  paths?: FreeflowPath [];
  color?: string;
  movable?: boolean;
}

export interface PointCoordinate {
  x: number;
  y: number;
}

export interface FreeflowPath {
  points: PointCoordinate [];
}

export enum EditorLayerType {
  Image,
  Freeflow
}

export interface LayerSelected {
  layer: BaseLayer;
  selected: boolean;
}

export abstract class BaseLayer {
  public layerUpdate = new EventEmitter<BaseLayer>();
  public layerSelect = new EventEmitter<LayerSelected>();
  public drawFinish = new EventEmitter<BaseLayer>();
  public selectedBorderColor = '#939393';
  public selectedBorderWidth = 1;
  public movable: boolean;
  public selectable = true;
  public type: EditorLayerType;

  public name: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public displayRatio: number;

  protected _originalDR: number;

  private _hidden = false;
  private _selected = false;

  public get hidden() {
    return this._hidden;
  }

  public set hidden(value: boolean) {
    this._hidden = value;
    this.layerUpdate.emit(this);
  }

  public get selected() {
    return this._selected;
  }

  public set selected(selected: boolean) {
    if (this.selectable && this.selected !== selected) {
      this._selected = selected;
      this.layerSelect.emit({layer: this, selected});
    }
  }

  constructor(name: string, displayRatio = 1, meta?: EditorLayer) {
    this.name = name;
    this.x = meta ? meta.x : 0;
    this.y = meta ? meta.y : 0;
    this.width = meta ? meta.width : 0;
    this.height = meta ? meta.height : 0;
    this.movable = meta ? meta.movable : true;
    this._originalDR = meta ? meta.displayRatio : 0;
    this.displayRatio = displayRatio;
    if (this._originalDR && this._originalDR !== this.displayRatio) {
      this.x = Math.round(this.x * (this.displayRatio / this._originalDR));
      this.y = Math.round(this.y * (this.displayRatio / this._originalDR));
    }
  }

  public trySelect(coords: PointCoordinate): boolean {
    if (this.selectable) {
      if (coords.x >= this.x && coords.x <= this.x + this.width && coords.y >= this.y && coords.y <= this.y + this.height) {
        return this.selected = true;
      }
    }
    return false;
  }

  public abstract draw();
}

export class ImageLayer extends BaseLayer {
  public src: string;
  public image: HTMLImageElement;
  public circle = false;

  constructor(private _context: any, name: string, displayRatio = 1, meta?: EditorLayer) {
    super(name, displayRatio, meta);
    this.src = meta ? meta.src : '';
    this.circle = meta ? meta.circle : false;
    this.type = EditorLayerType.Image;
  }

  public draw() {
    if (!this.hidden) {
      if (!this.image) {
        this.image = new Image();
        this.image.crossOrigin = 'Anonymous';
        this.image.src = this.src;
        this.image.width = Math.round(this.width * this.displayRatio);
        this.image.height = Math.round(this.height * this.displayRatio);
        this.image.onload = () => {
          if (this.selected) {
            this.drawSelectedBorder();
          }
          if (this.circle) {
            this.beginCircle();
          }
          this._context.drawImage(this.image,
                                  this.x,
                                  this.y,
                                  Math.round(this.width * this.displayRatio),
                                  Math.round(this.height * this.displayRatio));
          if (this.circle) {
            this.endCircle();
          }
          this.drawFinish.emit(this);
        };
      } else {
        if (this.selected) {
          this.drawSelectedBorder();
        }
        if (this.circle) {
          this.beginCircle();
        }
        this._context.drawImage(this.image,
                                this.x,
                                this.y,
                                Math.round(this.width * this.displayRatio),
                                Math.round(this.height * this.displayRatio));
        if (this.circle) {
          this.endCircle();
        }
        this.drawFinish.emit(this);
      }
    } else {
      this.drawFinish.emit(this);
    }
  }

  private beginCircle() {
    this._context.save();
    this._context.arc(this.x + Math.round(this.width * this.displayRatio) / 2,
                      this.y + Math.round(this.height * this.displayRatio) / 2,
                      Math.round(this.width * this.displayRatio) / 2,
                      0,
                      Math.PI * 2,
                      true);
    this._context.clip();
  }

  private endCircle() {
    this._context.restore();
  }

  private drawSelectedBorder() {
    this._context.strokeStyle = this.selectedBorderColor;
    this._context.lineWidth = this.selectedBorderWidth;
    this._context.strokeRect(this.x,
                            this.y,
                            Math.round(this.width * this.displayRatio),
                            Math.round(this.height * this.displayRatio));
  }
}

export class FreeflowLayer extends BaseLayer {

  public paths: FreeflowPath [];
  public color = 'red';
  public selectable = false;

  private _currentPath: FreeflowPath;

  constructor(private _context: any, name: string, displayRatio = 1, meta?: EditorLayer) {
    super(name, displayRatio, meta);
    this.paths = meta ? meta.paths : [];
    this.color = meta ? meta.color : 'red';
    this.type = EditorLayerType.Freeflow;
    this.movable = false;
    if (this._originalDR && this.displayRatio !== this._originalDR) {
      this.paths.forEach((path) => {
        path.points.forEach((point) => {
          point.x = Math.round(point.x * (this.displayRatio / this._originalDR));
          point.y = Math.round(point.y * (this.displayRatio / this._originalDR));
        });
      });
    }
  }

  public createPath() {
    const path = {points: []};
    this.paths.push(path);
    this._currentPath = path;
  }

  public addPoint(point: PointCoordinate) {
    this._currentPath.points.push(point);
    this.layerUpdate.emit(this);
  }

  public closePath() {
    if (this._currentPath) {
      this.optimize();
    }
    this._currentPath = null;
  }

  public draw() {
    if (!this.hidden) {
      this.paths.forEach((path) => {
        if (path.points.length > 1) {
          this._context.beginPath();
          this._context.moveTo(path.points[0].x, path.points[0].y);
          for (let i = 1; i < path.points.length; i++) {
            this._context.lineTo(path.points[i].x, path.points[i].y);
          }
          this._context.lineWidth = 5;
          this._context.strokeStyle = this.color;
          this._context.stroke();
          this._context.closePath();
        }
      });
    }
    this.drawFinish.emit(this);
  }

  private optimize() {
    const length = this._currentPath.points.length;
    const newPoints = [];
    if (length < 2) {
      return;
    }
    let start = this._currentPath.points[0];
    let slope = (this._currentPath.points[1].x - start.x) / (this._currentPath.points[1].y - start.y);
        let currentSlope; let current;
    newPoints.push(start);
    for (let i = 1; i < length; i++) {
      current = this._currentPath.points[i];
      currentSlope = (current.x - start.x) / (current.y - start.y);
      if (!isNaN(currentSlope) && currentSlope !== slope) {
        newPoints.push(current);
        slope = currentSlope;
        start = current;
      }
      if (i === length - 1) {
        newPoints.push(current);
      }
    }
    this._currentPath.points = newPoints;
  }
}
