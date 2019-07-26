export const required = (val) => {

    if (!val && typeof val !== 'number') {

        return 'Required';

    }

    return false;

};

export const funcMaxLength = (max) => (val) =>
    val && val.length > max && `Must be ${max} characters or less`;

export const funcMinLength = (min) => (val) =>
    (`${val}`).length < min && `Must be ${min} characters or more`;

export const number = (val) =>
    val && isNaN(Number(val)) && 'Must be a number';

export const funcMinNumber = (min) => (val) =>
    val && val < min && `Must be at least ${min}`;

export const email = (val) =>
    val && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val) && 'Invalid email address';

export const tooYoung = (val) =>
    val && val < 13 && 'You do not meet the minimum age requirement!';

export const aol = (val) =>
    val && /.+@aol\.com/.test(val) && 'Really? You still use AOL for your email?';

export const alphaNumeric = (val) =>
    val && /[^a-zA-Z0-9 ]/i.test(val) && 'Only alphanumeric characters';

export const phoneNumber = (val) =>
    val && !/^(0|[1-9][0-9]{9})$/i.test(val) && 'Invalid phone number, must be 10 digits';
