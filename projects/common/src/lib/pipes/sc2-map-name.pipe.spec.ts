import * as e from 'express';
import { SC2Map } from '../../public_api';
import { Sc2MapNamePipe } from './sc2-map-name.pipe';


describe('Sc2MapNamePipe', () => {
  let pipe: Sc2MapNamePipe;

  beforeEach(() => {
    pipe = new Sc2MapNamePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the name of the map', () => {
    expect(pipe.transform(SC2Map.TritonLE)).toEqual('Triton LE');
    expect(pipe.transform(SC2Map.OxideLE)).toEqual('Oxide LE');
    expect(pipe.transform(SC2Map.EternalEmpireLE)).toEqual('Eternal Empire LE');
    expect(pipe.transform(SC2Map.PurityAndIndustryLE)).toEqual('Purity and Industry LE');
    expect(pipe.transform(SC2Map.EverDreamLE)).toEqual('Ever Dream LE');
    expect(pipe.transform(SC2Map.SubmarineLE)).toEqual('Submarine LE');
    expect(pipe.transform(SC2Map.DeathauraLE)).toEqual('Deathaura LE');
    expect(pipe.transform(SC2Map.PillarsofGoldLE)).toEqual('Pillars of Gold LE');
    expect(pipe.transform(SC2Map.ZenLE)).toEqual('Zen LE');
    expect(pipe.transform(SC2Map.SimulacrumLE)).toEqual('Simulacrum LE');
    expect(pipe.transform(SC2Map.NightshadeLE)).toEqual('Nightshade LE');
    expect(pipe.transform(SC2Map.GoldenWallLE)).toEqual('Golden Wall LE');
    expect(pipe.transform(SC2Map.EphemeronLE)).toEqual('Ephemeron LE');
    expect(pipe.transform(SC2Map.WorldofSleepersLE)).toEqual('World of Sleepers LE');
    expect(pipe.transform(SC2Map.IceAndChromeLE)).toEqual('Ice and Chrome LE');
    expect(pipe.transform(SC2Map.RomanticideLE)).toEqual('Romanticide LE');
    expect(pipe.transform(SC2Map.JagannathaLE)).toEqual('Jagannatha LE');
    expect(pipe.transform(SC2Map.LightshadeLE)).toEqual('Lightshade LE');
  });

  it('should return an empty string if the map is undefined', () => {
    expect(pipe.transform(undefined)).toEqual('');
  });
});
