import { Pipe, type PipeTransform } from '@angular/core';

/** Placeholders entered for the team of participants without one. */
const NO_TEAM = /^[([]?\s*(teamless|no team|none|n\/a|-)?\s*[)\]]?$/i;

/** The team of a tournament participant, or an empty string for participants without a team. */
@Pipe({
  name: 'participantTeam'
})
export class ParticipantTeamPipe implements PipeTransform {

  public transform(team: string | null | undefined): string {
    const name = team?.trim() ?? '';
    return NO_TEAM.test(name) ? '' : name;
  }

}
