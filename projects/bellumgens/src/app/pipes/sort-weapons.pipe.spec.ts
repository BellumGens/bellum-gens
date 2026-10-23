import { SortWeaponsPipe } from './sort-weapons.pipe';
import { WeaponDescriptor } from '../../../../common/src/public_api';

describe('SortWeaponsPipe', () => {
  const pipe = new SortWeaponsPipe();
  const weapon = (name: string, kills: number): WeaponDescriptor => ({ name, kills, accuracy: 0 });

  it('lists the five weapons with the most kills, most first', () => {
    const weapons = [weapon('p90', 5), weapon('ak47', 50), weapon('m4a1', 30), weapon('awp', 30), weapon('deagle', 12), weapon('glock', 2)];

    expect(pipe.transform(weapons).map(w => w.name)).toEqual(['ak47', 'm4a1', 'awp', 'deagle', 'p90']);
  });

  it('leaves out the stats that are not weapons', () => {
    const weapons = [weapon('headshot', 900), weapon('knife_fight', 3), weapon('enemy_blinded', 4), weapon('ak47', 1)];

    expect(pipe.transform(weapons).map(w => w.name)).toEqual(['ak47']);
  });

  it('has nothing to sort without stats', () => {
    expect(pipe.transform(null)).toBeNull();
  });
});
