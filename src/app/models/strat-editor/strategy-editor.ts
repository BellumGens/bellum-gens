import { ElementRef } from '@angular/core';
import { BaseLayer,
  EditorLayerType,
  PointCoordinate,
  LayerSelected,
  ImageLayer,
  EditorLayer,
  FreeflowLayer } from './editor-layer';

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

  public save(): string {
    return JSON.stringify(this.layers,
      ['name', 'displayRatio', 'x', 'y', 'width', 'height', 'src', 'circle', 'paths', 'points', 'color', 'type', 'movable']);
  }

  public restore(metadata: string) {
    const layersMeta: EditorLayer [] = JSON.parse(metadata);
    this._layers.forEach((layer) => {
      this._unsubLayer(layer);
    });
    this._layers.length = 0;
    layersMeta.forEach((meta) => {
      const layer = this.createLayer(meta.type, meta);
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

  public trySelectLayer(coords: PointCoordinate) {
    for (let i = this.layers.length - 1; i > 0; i--) {
      if (this.layers[i].trySelect(coords)) {
        break;
      }
    }
  }

  public moveSelected(coords: PointCoordinate) {
    if (this._selectedLayer && this._selectedLayer.movable) {
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
      case EditorLayerType.Freeflow:
        return this.createFreeflowLayer(meta.name, meta);
    }
  }

  public createImageLayer(name?: string, meta?: EditorLayer): ImageLayer {
    return new ImageLayer(this._context, name || `Layer_${this.layers.length + 1}`, this._displayRatio, meta);
  }

  public createFreeflowLayer(name?: string, meta?: EditorLayer): FreeflowLayer {
    return new FreeflowLayer(this._context, name || `Layer_${this.layers.length + 1}`, this._displayRatio, meta);
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

  private _unsubLayer(layer: BaseLayer) {
    layer.layerUpdate.unsubscribe();
    layer.layerSelect.unsubscribe();
  }

  private _removeLayer(layer: BaseLayer) {
    this._unsubLayer(layer);
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
