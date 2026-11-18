import { Pipe, PipeTransform } from '@angular/core';

/** Formats a length in seconds as a game clock: `37:05`, or `1:02:09` past the hour. */
@Pipe({
  name: 'matchDuration'
})
export class MatchDurationPipe implements PipeTransform {

  public transform(seconds: number | null | undefined): string {
    if (seconds == null || !Number.isFinite(seconds) || seconds < 0) {
      return '';
    }
    const total = Math.floor(seconds);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = String(total % 60).padStart(2, '0');
    return hours > 0
      ? `${hours}:${String(minutes).padStart(2, '0')}:${secs}`
      : `${minutes}:${secs}`;
  }

}
