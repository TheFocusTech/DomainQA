export const QASE_LINK = ' https://app.qase.io/case';
export const GOOGLE_DOC_LINK =
    'https://docs.google.com/document/d/1ff46TvvPYvH_AZfc4Ilqv6Dbo9Jxp31GQh-IJhrr0wc/edit?tab=t.0#heading=h.';
export const HOSTED_ZONE_DOMAIN_NAME = '42.com';

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
    contacts: '/settings/contacts',
};

export const INVALID_CREDS_AUTH = [
    { email: 'invalidEmail@gmail.com', password: process.env.USER_PASSWORD, name: 'invalid email and valid password' },
    { email: process.env.USER_EMAIL, password: 'invalidPassword', name: 'valid email and invalid password' },
    { email: 'invalidEmail@gmail.com', password: 'invalidPassword', name: 'invalid email and invalid password' },
];

export const VALID_CREDS_AUTH = {
    email: 'domain.aqa+100@gmail.com',
    password: 'QA_domain00',
};

export const COLORS = {
    red: 'rgb(242, 62, 62)',
};

export const PASSWORD = {
    password: `${process.env.USER_PASSWORD}`,
    newPassword: `NEW_${process.env.USER_PASSWORD}`,
};

export const TOAST_MESSAGE = {
    passwordChanged: 'Password changed successfully',
    dnssecEnabled: 'DNSSEC enabled',
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
    getHostedZones: '/users/hosted-zones?size=30',
    resourceRecords: '/resource-records',
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

export const MY_PROFILE_ITEMS = [
    `${process.env.USER_EMAIL}`,
    'Account settings',
    'Billing',
    'Currency USD ($)',
    'Log out',
];

export const DNS_RECORD_DATA = {
    A: {
        dnsType: 'A',
        name: 'google.com',
        addressIPv4: '169.234.34.45',
        expected: { content: '169.234.34.45' },
    },
    AAAA: {
        name: 'google.com',
        addressIPv6: '2001:0000:130F:0000:0000:09C0:876A:130B',
        expected: { content: '2001:0000:130F:0000:0000:09C0:876A:130B' },
    },
    CNAME: {
        name: 'google.com',
        target: 'google.com',
        expected: { content: 'google.com' },
    },
    DS: {
        name: 'google.com',
        keyTag: '65535',
        algorithm: '255',
        digestType: 'SHA-1',
        digest: '12324567890FFFFFFFFFAADDDD',
        expected: { content: '12324567890FFFFFFFFFAADDDD' },
    },
    MX: {
        name: 'google.com',
        mailserver: 'subzerodirol.org',
        priority: '65535',
        expected: { content: 'subzerodirol.org' },
    },
    NS: {
        name: 'google.com',
        nameserver: 'google.com',
        expected: { content: 'google.com' },
    },
    TXT: {
        name: 'google.com',
        value: 'google123434545',
        expected: { content: 'google123434545' },
    },
    comment: 'For Test Only!',
};

export const DOMAIN_PART = ['.com', '.net', 'org'];

export const EXPECTED_RESULT_OCCUPIED_DOMAIN_SEARCH = [OCCUPIED_DOMAIN, 'This domain is already taken', 'Who owns?'];

export const CONTACTS = {
    predefined: {
        alias: 'Use a pre-defined contact (free and recommended option) as the first layer of WHOIS privacy',
        firstName: 'Registration',
        lastName: 'Private',
        company: 'Perfect Privacy LLC c/o trustname.com',
        jobTitle: 'Chief Privacy Defender',
        addressLineFirst: 'Harakiri.org',
        addressLineSecond: 'Hamilton Development Unit B',
        city: 'Charlestown',
        state: 'Nevis West Indies',
        zip: '00000',
        country: 'KN',
        phone: '+19179671610',
        fax: 'No details added',
        email: '000001025-protected@harakiri.org',
        emailWhoIs: 'Fill out the Contact Domain Owner form at https://harakiri.org/contact/',
    },
};
