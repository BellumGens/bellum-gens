import { EventEmitter } from '@angular/core';

export interface EditorLayer {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  circle?: boolean;
  src?: string;
}

export interface PointCoordinate {
  x: number;
  y: number;
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
  private _hidden = false;
  private _selected = false;
  public selectedBorderColor = '#939393';
  public selectedBorderWidth = 1;

  public name: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public displayRatio: number;

  public layerUpdate = new EventEmitter<BaseLayer>();
  public layerSelect = new EventEmitter<LayerSelected>();
  public drawFinish = new EventEmitter<BaseLayer>();

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
    this._selected = selected;
    this.layerSelect.emit({layer: this, selected: selected});
  }

  public constructor(name: string, displayRatio = 1, meta?: EditorLayer) {
    this.name = name;
    this.x = meta ? meta.x : 0;
    this.y = meta ? meta.y : 0;
    this.width = meta ? meta.width : 0;
    this.height = meta ? meta.height : 0;
    this.displayRatio = displayRatio;
  }

  public abstract draw();
}

export class ImageLayer extends BaseLayer {
  public src: string;
  public image: HTMLImageElement;
  public circle = false;

  public constructor(private _context: any, name: string, displayRatio = 1, meta?: EditorLayer) {
    super(name, displayRatio, meta);
    this.src = meta ? meta.src : '';
    this.circle = meta ? meta.circle : false;
  }

  public draw() {
    if (!this.hidden) {
      if (!this.image) {
        this.image = new Image();
        if (this.src.startsWith('https://steamcdn-a.akamaihd.net/steamcommunity/public/')) {
          this.image.src = `/proxy/steam/${encodeURIComponent(this.src)}`;
        } else {
          this.image.src = this.src;
        }
        this.image.width = Math.floor(this.width * this.displayRatio);
        this.image.height = Math.floor(this.height * this.displayRatio);
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
                                  Math.floor(this.width * this.displayRatio),
                                  Math.floor(this.height * this.displayRatio));
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
                                Math.floor(this.width * this.displayRatio),
                                Math.floor(this.height * this.displayRatio));
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
    this._context.arc(this.x + Math.floor(this.width * this.displayRatio) / 2,
                      this.y + Math.floor(this.height * this.displayRatio) / 2,
                      Math.floor(this.width * this.displayRatio) / 2,
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
                            Math.floor(this.width * this.displayRatio),
                            Math.floor(this.height * this.displayRatio));
  }
}

export class FreeflowLayer extends BaseLayer {

  public paths: PointCoordinate [];

  constructor(private _context: any, name: string, displayRatio = 1, meta?: EditorLayer) {
    super(name, displayRatio, meta);
  }

  public draw() {
    if (this.paths.length > 1) {
      for (let i = 0; i < this.paths.length - 1; i++) {
        this._context.beginPath();
        this._context.moveTo(this.paths[i]);
        this._context.lineTo(this.paths[i + 1]);
        this._context.stroke();
        this._context.closePath();
      }
    }
  }
}
