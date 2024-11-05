export const QASE_LINK = ' https://app.qase.io/case';
export const GOOGLE_DOC_LINK =
    'https://docs.google.com/document/d/1ff46TvvPYvH_AZfc4Ilqv6Dbo9Jxp31GQh-IJhrr0wc/edit?tab=t.0#heading=h.';
export const HOSTED_ZONE_DOMAIN_NAME = '523.com';

export const URL_ENDPOINT = {
    login: '/auth/sign-in',
    signup: '/auth/sign-up',
    hostedZones: '/hosted-zones/management',
    accountSettings: '/settings/general',
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
    hostedZoneCreated: 'Hosted zone created',
    hostedZoneDeleted: 'Hosted zone deleted',
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
export const CURRENCY_EUR_BUTTON_TEXT = 'Currency EUR (€)';
export const CURRENCY_USD_BUTTON_TEXT = 'Currency USD ($)';

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

export const MODAL_WINDOW_DELETE_HOSTED_ZONE = [
    'Are you sure you want to delete hosted zone ',
    ' and all related DNS-records?',
    'Delete hosted zone',
];

export const HEADER_LINKS = [
    {
        type: 'dropdown',
        trigger: 'Domains',
        links: [
            {
                name: 'Registered domains',
                expectedUrl: '/domains/management',
                heading: 'Registered Domains',
                buttons: ['Transfer', 'Get new domain'],
                result: 'No registered domains yet',
                text: 'Buy a new domain name or transfer it and it will appear here',
            },
            {
                name: 'Hosted zones',
                expectedUrl: '/hosted-zones/management',
                heading: 'Hosted Zones',
                buttons: ['Create hosted zone'],
                result: 'No hosted  zones yet',
                text: 'Create new hosted zone and it will appear here',
            },
            {
                name: 'Transfer',
                expectedUrl: '/transfer',
                heading: 'Transfer your .com domain to Trustname for $12.99',
                buttons: ['Transfer', 'Bulk transfer', 'My transfers'],
                result: '',
                text: '',
            },
            {
                name: 'WHOIS',
                expectedUrl: '/whois',
                heading: 'Whois Domain Lookup',
                buttons: ['Search'],
                result: '',
                text: '',
            },
        ],
    },
    {
        type: 'dropdown',
        trigger: 'Products',
        links: [
            {
                name: 'Hosting',
                expectedUrl: '/hosting/management',
                heading: 'Hosting',
                buttons: ['Get new hosting'],
                result: 'No hostings yet',
                text: 'Buy a new hosting and it will appear here',
            },
            {
                name: 'SSL certificates',
                expectedUrl: '/certificates',
                heading: 'SSL certificates provide reliable security',
                buttons: ['Secure your site'],
                result: '',
                text: '',
            },
            // {
            //     name: 'Email (soon)',
            //     expectedUrl: '',
            //     heading: '',
            //     buttons: [],
            //     result: '',
            //     text: '',
            // },
        ],
    },
    {
        type: 'direct',
        name: 'Blog',
        expectedUrl: '/blog ',
        heading: 'Trustname Blog',
        buttons: ['Search'],
        result: '',
        text: '',
    },
    {
        type: 'direct',
        name: 'Logo',
        expectedUrl: '/',
        heading: 'Millions of domains with the ulitmate privacy protection',
        buttons: ['Search'],
        result: '',
        text: '',
    },
    {
        type: 'direct',
        name: 'Help center',
        expectedUrl: '/help',
        heading: 'How can we help you?',
        buttons: ['Search', 'Report abuse'],
        result: '',
        text: '',
    },
    {
        type: 'direct',
        name: 'Home',
        expectedUrl: '/',
        heading: 'Millions of domains with the ulitmate privacy protection',
        buttons: ['Search'],
        result: '',
        text: '',
    },
];
