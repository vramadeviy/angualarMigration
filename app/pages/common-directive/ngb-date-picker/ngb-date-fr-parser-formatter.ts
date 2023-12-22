export function toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }
  
  export function toString(value: any): string {
    return (value !== undefined && value !== null) ? `${value}` : '';
  }
  
  export function getValueInRange(value: number, max: number, min = 0): number {
    return Math.max(Math.min(value, max), min);
  }
  
  export function isString(value: any): value is string {
    return typeof value === 'string';
  }
  
  export function isNumber(value: any): value is number {
    return !isNaN(toInteger(value));
  }
  
  export function isInteger(value: any): value is number {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }
  
  export function isDefined(value: any): boolean {
    return value !== undefined && value !== null;
  }
  
  export function padNumber(value: number) {
    if (isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }
  
  export function regExpEscape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
// import {NgbDateStruct} from './ngb-date-struct';
import {NgbDateStruct} from  './ngbDateStruct'
import {NgbDateParserFormatter} from  './ngbDateParserFormatter'

export class NgbDateFRParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return {year: toInteger(dateParts[0]), month: null, day: null};
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return {year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null};
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return {year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2])};
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date ?
        `${isNumber(date.month) ? padNumber(date.month) : ''}/${isNumber(date.day) ? padNumber(date.day) : ''}/${date.year}` :
        '';
  }
}