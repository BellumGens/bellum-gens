import { HasVotedPipe } from './has-voted.pipe';

describe('HasVotedPipe', () => {
  it('create an instance', () => {
    const pipe = new HasVotedPipe();
    expect(pipe).toBeTruthy();
  });
});
