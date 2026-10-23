import { TruncateTextPipe } from './truncate-text.pipe';

describe('TruncateTextPipe', () => {
  const pipe = new TruncateTextPipe();

  it('shortens long text to the maximum length, ellipsis included', () => {
    expect(pipe.transform('A strategy with a very long descriptive name')).toBe('A strategy with a very long...');
    expect(pipe.transform('Mirage A split', 10)).toBe('Mirage ...');
  });

  it('keeps text that fits', () => {
    expect(pipe.transform('Mirage A split')).toBe('Mirage A split');
    expect(pipe.transform('Exactly ten', 11)).toBe('Exactly ten');
  });

  it('passes empty values through', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform('')).toBe('');
  });
});
