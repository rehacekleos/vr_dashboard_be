import * as crypto from "crypto";
import _ from 'lodash';

export function isEmpty(value: any){
    return value === null || value === undefined || (typeof value === 'string' && value.toString().trim() === "");
}

export function generateCode(): string {
    return crypto.randomBytes(6).toString();
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