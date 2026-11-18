import { Pipe, PipeTransform } from '@angular/core';

/** The name of a Dota 2 hero, or a numbered placeholder when Steam did not return the hero list. */
@Pipe({
  name: 'dota2HeroName'
})
export class Dota2HeroNamePipe implements PipeTransform {

  public transform(hero: { heroId: number; heroName: string | null } | null | undefined): string {
    if (!hero) {
      return '';
    }
    return hero.heroName || $localize`:Dota 2 hero placeholder, shown when the hero name is unknown@@dota2UnknownHero:Hero #${hero.heroId}:heroId:`;
  }

}
