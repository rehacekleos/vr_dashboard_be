import { customAlphabet } from 'nanoid'
import _ from 'lodash';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)

export function isEmpty(value: any){
    return value === null || value === undefined || (typeof value === 'string' && value.toString().trim() === "");
}

export function generateCode(length = 12): string {
    const nanoId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', length)
    return nanoId();
}


/**
 * Checks if a value is empty, null, undefined, NaN or a non-empty value.
 * @param value - The value to check.
 * @returns True if the value is empty, null, undefined or NaN, false otherwise.
 */
export function isEmptyAndNull(value: any) {
    if (_.isString(value)) {
        return _.isEmpty(value);
    }
    if (_.isObject(value)) {
        return _.isEmpty(value);
    }
    return _.isNil(value) || isNaN(value);
}

export function isDateValid(...date: string[]): boolean {
    const args = [...date];
    for (const arg of args) {
        if (!dayjs(arg).isValid()) {
            throw new Error(`Date is not valid`);
        }
    }
    return true;
}


/**
 * Sort two dates in ascending order
 * @param a - The first date
 * @param b - The second date
 * @returns -1 if a is after b, 1 if a is before b, 0 if they are equal.
 */
export function sortDate(a: string, b: string) {
    const queryA = dayjs.utc(a);
    const queryB = dayjs.utc(b);

    if (queryB < queryA) {
        return -1;
    }
    if (queryB > queryA) {
        return 1;
    }
    return 0;
}