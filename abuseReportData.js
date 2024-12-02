import { faker } from '@faker-js/faker';

export const ABUSE_REPORT_TYPES = [
    'DMCA, Copyright & Trademark Complaints',
    'Malware, Botnets & Spam',
    'Phishing & Pharming',
    'Hacking Activity',
    'Hijacking & Domain Name Dispute',
    'Other Illegal Activities',
    'Pharmacy Complaint',
    'CSAM (Child Abuse)',
    'Inaccurate Whois',
    'Criminal or Civil Subpoena',
    'Warrants',
    'Court Order',
    'UDRP',
];

export const REQUIRED_FIELDS = {
    'Date of Issue': faker.date.past().toISOString().split('T')[0],
    'Abuse subject': 'AUTOTST',
    'Details or Explanation': faker.lorem.paragraph(),
    'Your Email': faker.internet.email(),
    'The offending domain name(s)': faker.internet.domainName(),
    'Digital signature': faker.string.numeric(10),
    'Support Code #': faker.number.int({ min: 100000, max: 999999 }).toString(),
    'Target of the attack': faker.lorem.word(),
    'User-agent (mobile phone, PC) and browser': faker.internet.userAgent(),
    Complainant: faker.person.fullName(),
    Respondent: faker.person.fullName(),
    'Arbitrator Email Address': faker.internet.email(),
    'Arbitrator Organization': faker.company.name(),
    'Start Date': faker.date.past().toISOString().split('T')[0],
    'Due Date': faker.date.future().toISOString().split('T')[0],
    'Country your IP address belongs to': faker.location.country(),
};

export const DROPDOWN_FIELDS = [
    'Desired outcome',
    'Country of Issue (Criminal or Civil Subpoena)',
    'Jurisdiction of Infringement',
    'Jurisdiction of the Registrant',
];
