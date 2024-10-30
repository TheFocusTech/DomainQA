export const QASE_LINK = ' https://app.qase.io/case';
export const GOOGLE_DOC_LINK =
    'https://docs.google.com/document/d/1ff46TvvPYvH_AZfc4Ilqv6Dbo9Jxp31GQh-IJhrr0wc/edit?tab=t.0#heading=h.';
export const HOSTED_ZONE_DOMAIN_NAME = '523.com';

export const URL_ENDPOINT = {
    login: '/auth/sign-in',
    signup: '/auth/sign-up',
    hostedZones: '/hosted-zones/management',
    Transfer: '/transfer',
    HomePage: '/',
    WhoIs: '/whois',
    SSLCertificates: '/certificates',
    Blog: '/blog',
    HelpCenter: '/help',
    ReportAbuse: '/help/report-abuse',
    ContactUs: '/help/contact-us',
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
    hostedZoneCreated: 'Hosted zone created'
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

export const CORRECT_DOMAIN = 'PURRWEB.COM';

export const OCCUPIED_DOMAIN = 'purrweb';

export const AVAILABLE_DOMAIN = 'strain123';

export const ACCESSIBLE_PAGE_TITLE = {
    Transfer: 'Transfer your .com domain to Trustname for $12.99',
    HomePage: 'Millions of domains with the ulitmate privacy protection',
    WhoIs: 'Whois Domain Lookup',
    SSLCertificates: 'SSL certificates provide reliable security',
    Blog: 'Trustname Blog',
    HelpCenter: 'How can we help you?',
    ReportAbuse: 'Report Abuse',
    ContactUs: 'Contact us',
};

export const WHOIS_SEARCH_RESULT_TITLES = [
    'Domain Name',
    'Registry Domain ID',
    'Registrar WHOIS Server',
    'Registrar URL',
];

export const DNS_RECORD_DATA = {
    A: {
        name: 'www.42.com',
        addressIPv4: '206.253.208.100',
        ttl: 'AUTO',
    },
    AAAA: {
        name: 'www.42.com',
        addressIPv6: '1050:0:0:0:5:600:300c:326b',
        ttl: 'AUTO',
    },
    CHAME: {
        name: 'www.example.com',
        target: 'example.com',
        ttl: 'AUTO',
    },
    DS: {
        name: '42.com',
        keyTag: '2371',
        algorithm: '8',
        digestType: '2',
        digest: '2BB183AF5F22588179A53B0A98631FAD1A292118',
        ttl: 'AUTO',
    },
    MX: {
        name: 'example.com',
        mailserver: 'mail.example.com',
        priority: '10',
        ttl: 'AUTO',
    },
    NS: {
        name: '42.com',
        nameserver: 'ns1.example.com',
        ttl: 'AUTO',
    },
    TXT: {
        name: '42.com',
        value: 'v=spf1 include:_spf.example.com super test',
        ttl: 'AUTO',
    },
    comment: 'For Test Only!',
};

export const DOMAIN_PART = ['.com', '.net', 'org'];

export const EXPECTED_RESULT_OCCUPIED_DOMAIN_SEARCH = [OCCUPIED_DOMAIN, 'This domain is already taken', 'Who owns?'];
