import { ElementRef, EventEmitter } from '@angular/core';

export abstract class BaseLayer {
  private _hidden = false;

  public name: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  public layerUpdate = new EventEmitter<BaseLayer>();
  public drawFinish = new EventEmitter<BaseLayer>();

  public get hidden() {
    return this._hidden;
  }

  public set hidden(value: boolean) {
    this._hidden = value;
    this.layerUpdate.emit(this);
  }

  public constructor(name: string) {
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
  }

  public abstract draw();
}

export class ImageLayer extends BaseLayer {
  src: string;
  image: HTMLImageElement;
  circle = false;

  public constructor(private _context: any, name: string) {
    super(name);
  }

  public draw() {
    if (!this.hidden) {
      if (!this.image) {
        this.image = new Image();
        this.image.src = this.src;
        this.image.onload = () => {
          if (this.circle) {
            this.beginCircle();
          }
          this._context.drawImage(this.image, this.x, this.y, this.width, this.height);
          if (this.circle) {
            this.endCircle();
          }
          this.drawFinish.emit(this);
        };
      } else {
        if (this.circle) {
          this.beginCircle();
        }
        this._context.drawImage(this.image, this.x, this.y, this.width, this.height);
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
    this._context.arc(this.x + this.width / 2,
                      this.y + this.height / 2,
                      this.width / 2,
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
  type: EditorLayerType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum EditorLayerType {
  Image,
  Draw
}

export class StrategyEditor {
  private _context: any;
  private _layers: BaseLayer[] = [];
  private _layerIndex = 0;
  private _surfaceName: string;

  constructor(private _canvas: ElementRef, name?: string) {
    this._context = this._canvas.nativeElement.getContext('2d');
    this._surfaceName = name ? name : this.generateId();
  }

  public flip(index = 0) {
    if (index === 0) {
      this._context.clearRect(0, 0, 1024, 1024);
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

  public createLayer(type): BaseLayer {
    switch (type) {
      case EditorLayerType.Image:
        return this.createImageLayer();
    }
  }

  public createImageLayer(): ImageLayer {
    return new ImageLayer(this._context, `Layer_${this._layerIndex++}`);
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

  private generateId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
