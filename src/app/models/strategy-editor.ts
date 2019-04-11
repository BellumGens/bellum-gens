import { ElementRef, EventEmitter } from '@angular/core';

export abstract class BaseLayer {
  private _hidden = false;

  public name: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public displayRatio: number;
  public selected = false;

  public layerUpdate = new EventEmitter<BaseLayer>();
  public drawFinish = new EventEmitter<BaseLayer>();

  public get hidden() {
    return this._hidden;
  }

  public set hidden(value: boolean) {
    this._hidden = value;
    this.layerUpdate.emit(this);
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
        this.image.src = this.src;
        this.image.crossOrigin = 'Anonymous';
        this.image.width = Math.floor(this.width * this.displayRatio);
        this.image.height = Math.floor(this.height * this.displayRatio);
        this.image.onload = () => {
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
}

export interface EditorLayer {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  circle?: boolean;
  src?: string;
}

export enum EditorLayerType {
  Image,
  Draw
}

export class StrategyEditor {
  private _context: any;
  private _layers: BaseLayer[] = [];
  private _layerIndex = 0;
  private _width = 1024;
  private _height = 1024;
  private _displayRatio: number;

  private _selectedLayer: BaseLayer;

  public surfaceName: string;

  constructor(private _canvas: ElementRef, displayRatio = 1, name?: string) {
    this._context = this._canvas.nativeElement.getContext('2d');
    this._displayRatio = displayRatio;
    this.surfaceName = name ? name : this.generateId();
  }

  public restore(metadata: string) {
    const layersMeta: EditorLayer [] = JSON.parse(metadata);
    this._layers.forEach((layer) => {
      this.removeLayer(layer);
    });
    layersMeta.forEach((meta) => {
      const layer = this.createLayer(EditorLayerType.Image, meta);
      this.addLayer(layer);
    });
  }

  public flip(index = 0) {
    if (index === 0) {
      this._context.clearRect(0, 0, this._width, this._height);
    }
    if (this._layers.length > index) {
      const layer = this._layers[index];
      const sub = layer.drawFinish.subscribe(_ => {
        this.flip(++index);
        sub.unsubscribe();
      });
      layer.draw();
    }
  }

  public get layers() {
    return this._layers;
  }

  public createLayer(type, meta?: EditorLayer): BaseLayer {
    switch (type) {
      case EditorLayerType.Image:
        return this.createImageLayer(meta.name, meta);
    }
  }

  public createImageLayer(name?: string, meta?: EditorLayer): ImageLayer {
    return new ImageLayer(this._context, name || `Layer_${this._layerIndex++}`, this._displayRatio, meta);
  }

  public addLayer(layer: BaseLayer) {
    layer.layerUpdate.subscribe(_ => this.flip());
    this._layers.push(layer);
    this.flip();
  }

  public insertLayer(layer: BaseLayer, index: number) {
    if (index < this._layers.length) {
      layer.layerUpdate.subscribe(_ => this.flip());
      this._layers.splice(index, 0, layer);
      this.flip();
    } else {
      this.addLayer(layer);
    }
  }

  public replaceLayer(index: number, layer: BaseLayer) {
    if (index < this._layers.length) {
      this._layers[index].layerUpdate.unsubscribe();
      layer.layerUpdate.subscribe(_ => this.flip());
      this._layers.splice(index, 1, layer);
      this.flip();
    } else {
      this.addLayer(layer);
    }
  }

  public removeLayer(layer: BaseLayer) {
    layer.layerUpdate.unsubscribe();
    this._layers.splice(this._layers.indexOf(layer), 1);
    this.flip();
  }

  private generateId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
