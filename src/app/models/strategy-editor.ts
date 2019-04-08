import { ElementRef } from '@angular/core';

export abstract class BaseLayer {
  public name: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;

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
  src?: string;
  image?: HTMLImageElement;

  public constructor(private _context: any, name: string) {
    super(name);
  }

  public draw() {
    if (!this.image) {
      this.image = new Image();
      this.image.src = this.src;
      this.image.onload = () => {
        this._context.drawImage(this.image, this.x, this.y, this.width, this.height);
      };
    } else {
      this._context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
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

  public flip() {
    this._layers.forEach((layer) => {
      layer.draw();
    });
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
    this._layers.push(layer);
  }

  public insertLayer(layer: BaseLayer, index: number) {
    if (index < this._layers.length) {
      this._layers.splice(index, 0, layer);
    } else {
      this.addLayer(layer);
    }
  }

  public replaceLayer(index: number, layer: BaseLayer) {
    if (index < this._layers.length) {
      this._layers.splice(index, 1, layer);
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
