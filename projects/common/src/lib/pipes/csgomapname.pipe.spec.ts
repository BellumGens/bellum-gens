import { CSGOMapnamePipe } from './csgomapname.pipe';
import { CSGOMap } from '../../models/csgomaps';


describe('CSGOMapnamePipe', () => {
  let pipe: CSGOMapnamePipe;

  beforeEach(() => {
    pipe = new CSGOMapnamePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms a CSGOMap enum into its display name', () => {
    expect(pipe.transform(CSGOMap.Dust2)).toEqual('Dust 2');
    expect(pipe.transform(CSGOMap.Mirage)).toEqual('Mirage');
    expect(pipe.transform(CSGOMap.Inferno)).toEqual('Inferno');
    expect(pipe.transform(CSGOMap.Overpass)).toEqual('Overpass');
    expect(pipe.transform(CSGOMap.Train)).toEqual('Train');
    expect(pipe.transform(CSGOMap.Nuke)).toEqual('Nuke');
    expect(pipe.transform(CSGOMap.Vertigo)).toEqual('Vertigo');
    expect(pipe.transform(CSGOMap.Ancient)).toEqual('Ancient');
  });

  it('returns an empty string if the input is null or undefined', () => {
    expect(pipe.transform(null)).toEqual('');
    expect(pipe.transform(undefined)).toEqual('');
  });
});
