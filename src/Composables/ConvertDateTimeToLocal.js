import moment from 'moment';

export function ConvertDateTimeToLocal(value, format) {
    return moment.utc(String(value)).local().format(format);
}