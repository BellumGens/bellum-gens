import { FilterSizesPipe, isJerseySizeAvailable } from './filter-sizes.pipe';
import { JerseyCut, JerseySize } from '../../models/order';

describe('FilterSizesPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterSizesPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the male sizes for the male cut', () => {
    expect(new FilterSizesPipe().transform(JerseyCut.Male)).toEqual([
      { text: 'S', size: JerseySize.S },
      { text: 'M', size: JerseySize.M },
      { text: 'L', size: JerseySize.L },
      { text: 'XL', size: JerseySize.XL },
      { text: 'XXL', size: JerseySize.XXL },
      { text: 'XXXL', size: JerseySize.XXXL }
    ]);
  });

  it('should return the female sizes for the female cut', () => {
    expect(new FilterSizesPipe().transform(JerseyCut.Female)).toEqual([
      { text: 'XS', size: JerseySize.XS },
      { text: 'S', size: JerseySize.S },
      { text: 'M', size: JerseySize.M },
      { text: 'L', size: JerseySize.L },
      { text: 'XL', size: JerseySize.XL }
    ]);
  });

  it('should tell whether a cut is available in a size', () => {
    expect(isJerseySizeAvailable(JerseyCut.Male, JerseySize.XXXL)).toBe(true);
    expect(isJerseySizeAvailable(JerseyCut.Male, JerseySize.XS)).toBe(false);
    expect(isJerseySizeAvailable(JerseyCut.Female, JerseySize.XS)).toBe(true);
    expect(isJerseySizeAvailable(JerseyCut.Female, JerseySize.XXL)).toBe(false);
    expect(isJerseySizeAvailable(JerseyCut.Female, undefined)).toBe(false);
  });
});
