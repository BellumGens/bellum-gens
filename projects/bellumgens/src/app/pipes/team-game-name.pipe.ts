import { Pipe, PipeTransform } from '@angular/core';
import { CSGOTeam, gameName, teamGame } from 'bellum-gens-common/models';

/** The name of the game a team plays. Game names are proper names, so they are not translated. */
@Pipe({
  name: 'teamGameName'
})
export class TeamGameNamePipe implements PipeTransform {

  public transform(team: CSGOTeam | null | undefined): string {
    return team ? gameName(teamGame(team)) : '';
  }

}
