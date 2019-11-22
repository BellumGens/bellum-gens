import { Pipe, PipeTransform } from '@angular/core';
import { ALL_ROLES } from '../../../src-common/models/playerrole';

@Pipe({
  name: 'queryParsed'
})
export class QueryParsedPipe implements PipeTransform {

  transform(query: string, player = false): string {
    if (query) {
      let result = '';
      if (player) {
        const parts = query.split('&');
        parts.forEach(part => {
          const token = part.split('=');
          if (token[0] === 'role' && token[1] !== 'null') {
            result += ` playing as ${ALL_ROLES.find(r => r.Id.toString() === token[1]).Name}`;
          } else if (token[0] === 'overlap' && token[1] !== '0') {
            result += ` with availability overlap of at least ${token[1]} hours`;
          } else if (token[0] === 'name' && token[1]) {
            result += ` with name containing '${token[1]}'`;
          }
        });
        if (!result) {
          result += ' with no search criteria';
        }
        return result;
      } else {
        const parts = query.split('&');
        parts.forEach(part => {
          const token = part.split('=');
          if (token[0] === 'role' && token[1] !== 'null') {
            result += ` looking for ${ALL_ROLES.find(r => r.Id.toString() === token[1]).Name}`;
          } else if (token[0] === 'overlap' && token[1] !== '0') {
            result += ` with availability overlap of at least ${token[1]} hours`;
          } else if (token[0] === 'name' && token[1]) {
            result += ` with name containing '${token[1]}'`;
          }
        });
        if (!result) {
          result += ' with no search criteria';
        }
        return result;
      }
    }
    return ' with no search criteria';
  }

}
