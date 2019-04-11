import { ElementRef, EventEmitter } from '@angular/core';

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

export interface LayerSelected {
  layer: BaseLayer;
  selected: boolean;
}

export enum EditorLayerType {
  Image,
  Draw
}

export abstract class BaseLayer {
  private _hidden = false;
  private _selected = false;
  public selectedBorderColor = '#999';
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
        this.image.src = this.src;
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

export class StrategyEditor {
  private _context: any;
  private _layers: BaseLayer[] = [];
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
      this._removeLayer(layer);
    });
    layersMeta.forEach((meta) => {
      const layer = this.createLayer(EditorLayerType.Image, meta);
      this._addLayer(layer);
    });
    this.flip();
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

  public moveSelected(coords: PointCoordinate) {
    if (this._selectedLayer) {
      this._selectedLayer.x += coords.x;
      this._selectedLayer.y += coords.y;
      this.flip();
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
    return new ImageLayer(this._context, name || `Layer_${this.layers.length + 1}`, this._displayRatio, meta);
  }

  public addLayer(layer: BaseLayer) {
    this._addLayer(layer);
    this.flip();
  }

  private _addLayer(layer) {
    layer.layerUpdate.subscribe(_ => this.flip());
    layer.layerSelect.subscribe(current => this._selectionChanged(current));
    this._layers.push(layer);
  }

  public insertLayer(index: number, layer: BaseLayer) {
    if (index < this._layers.length) {
      this._insertLayer(layer, index);
      this.flip();
    } else {
      this.addLayer(layer);
    }
  }

  private _insertLayer(layer: BaseLayer, index: number) {
    layer.layerUpdate.subscribe(_ => this.flip());
    layer.layerSelect.subscribe(current => this._selectionChanged(current));
    this._layers.splice(index, 0, layer);
  }

  public replaceLayer(index: number, layer: BaseLayer) {
    if (index < this._layers.length) {
      this._replaceLayer(index, layer);
      this.flip();
    } else {
      this.addLayer(layer);
    }
  }

  private _replaceLayer(index: number, layer: BaseLayer) {
    this._layers[index].layerUpdate.unsubscribe();
    this._layers[index].layerSelect.unsubscribe();
    layer.layerUpdate.subscribe(_ => this.flip());
    layer.layerSelect.subscribe(current => this._selectionChanged(current));
    this._layers.splice(index, 1, layer);
  }

  public removeLayer(layer: BaseLayer) {
    this._removeLayer(layer);
    this.flip();
  }

  private _removeLayer(layer: BaseLayer) {
    layer.layerUpdate.unsubscribe();
    layer.layerSelect.unsubscribe();
    this._layers.splice(this._layers.indexOf(layer), 1);
  }

  public deselectAll() {
    if (this._selectedLayer) {
      this._selectedLayer.selected = false;
      this._selectedLayer = null;
      this.flip();
    }
  }

  private _selectionChanged(args: LayerSelected) {
    if (args.selected) {
      if (this._selectedLayer) {
        this._selectedLayer.selected = false;
      }
      this._selectedLayer = args.layer;
    } else {
      if (this._selectedLayer === args.layer) {
        this._selectedLayer = null;
      }
    }
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
