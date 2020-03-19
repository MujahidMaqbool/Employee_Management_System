import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { isNumber, toInteger, padNumber } from './util';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
    parse(value: string): NgbDateStruct {
        if (value) {
            const dateParts = value.trim().split('/');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return { day: toInteger(dateParts[0]), month: null, year: null };
            } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return { day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: null };
            } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return { day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: toInteger(dateParts[2]) };
            }
        }
        return null;
    }

    format(date: NgbDateStruct): string {
        return date ?
            `${isNumber(date.day) ? padNumber(date.day) : ''}/${isNumber(date.month) ? padNumber(date.month) : ''}/${date.year}` : '';
    }
}


///for date picker
export function SetDatePickerDateWithNewDate(date: any): NgbDateStruct {

    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

export function SetDatePickerDate(date: any): NgbDateStruct {

    let date1 = new Date(date);
    return { year: date1.getFullYear(), month: date1.getMonth() + 1, day: date1.getDate() };
}

export function getDatePickerDate(date: any): Date {
    return new Date(date.year + '-' + date.month + '-' + date.day + ' 00:00');
}