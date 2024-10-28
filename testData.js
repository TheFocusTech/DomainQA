export const QASE_LINK = 'https://app.qase.io/project/01?';
export const GOOGLE_DOC_LINK =
    'https://docs.google.com/document/d/1ff46TvvPYvH_AZfc4Ilqv6Dbo9Jxp31GQh-IJhrr0wc/edit?tab=t.0#heading=h.';
export const HOSTED_ZONE_DOMAIN_NAME = '42.com';

export const URL_ENDPOINT = {
    login: '/auth/sign-in',
    signup: '/auth/sign-up',
    hostedZones: '/hosted-zones/management',
};

export const INVALID_CREDS_AUTH = [
    { email: 'invalidEmail@gmail.com', password: process.env.USER_PASSWORD, name: 'invalid email and valid password' },
    { email: process.env.USER_EMAIL, password: 'invalidPassword', name: 'valid email and invalid password' },
    { email: 'invalidEmail@gmail.com', password: 'invalidPassword', name: 'invalid email and invalid password' },
];

export const COLORS = {
    red: 'rgb(242, 62, 62)',
};

export const PASSWORD = {
    password: `${process.env.USER_PASSWORD}`,
    newPassword: `NEW_${process.env.USER_PASSWORD}`,
};

export const TOAST_MESSAGE = {
    passwordChanged: 'Password changed successfully',
};

export const NEGATIVE_EMAIL_DATA_SET = [
    ['without @', 'test.test.gmail', 'Invalid email address'],
    ['without domain', 'test@gmail', 'Invalid email address'],
    ['domain less than 2 characters', 'test@gmail.s', 'Invalid email address'],
];

export const API_ENDPOINT = {
    login: '/auth/sign-in',
    createHostedZone: '/users/hosted-zones',
    deleteHostedZone: '/users/hosted-zones/',
    getHostedZones: '/users/hosted-zones?',
};

export const DNS_TYPE = {
    A: 'A',
    AAAA: 'AAAA',
    CNAME: 'CNAME',
    DS: 'DS',
    MX: 'MX',
    NS: 'NS',
    TXT: 'TXT',
};

export const ERROR_DOMAIN = 'FGGFFGDGDFGD.COM';

export const CORRECT_DOMAIN = 'purrweb.com';
