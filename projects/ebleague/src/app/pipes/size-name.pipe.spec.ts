import { SizeNamePipe } from './size-name.pipe';
import { JerseySize } from '../../../../common/src/public_api';

describe('SizeNamePipe', () => {
  it('create an instance', () => {
    const pipe = new SizeNamePipe();
    expect(pipe).toBeTruthy();
  });

  it('names each jersey size', () => {
    const pipe = new SizeNamePipe();
    const sizes = [JerseySize.XS, JerseySize.S, JerseySize.M, JerseySize.L, JerseySize.XL, JerseySize.XXL, JerseySize.XXXL];

    expect(sizes.map(size => pipe.transform(size))).toEqual(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']);
  });

  it('names an unknown size with an empty string', () => {
    const pipe = new SizeNamePipe();

    expect(pipe.transform(undefined)).toBe('');
  });
});
