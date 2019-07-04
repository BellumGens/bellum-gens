import { IsVideoPipe } from './is-video.pipe';

describe('IsVideoPipe', () => {
  it('create an instance', () => {
    const pipe = new IsVideoPipe();
    expect(pipe).toBeTruthy();
  });
});
