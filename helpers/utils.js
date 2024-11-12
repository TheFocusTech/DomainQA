import { TOTP } from 'totp-generator';
import { RANDOM_CHARACTERS, NAME_SEARCH } from '../testData';
import { getResponseHelpSearchAPI } from '../helpers/apiCalls';

export function generateVerificationCode(secretKey) {
    const { otp, expires } = TOTP.generate(secretKey);
    return { otp, expires };
}

export async function getRandomDomainName() {
    const date = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
    const domainName = `api-${date}.com`;
    return domainName;
}

export async function getCookies(page) {
    const cookies = await page.context().cookies();
    const headers = {};
    for (const cookie of cookies) {
        headers[cookie.name] = cookie.value;
    }
    return headers;
}

export async function getRandomCharacters(length) {
    return Array.from({ length }, () =>
        RANDOM_CHARACTERS.charAt(Math.floor(Math.random() * RANDOM_CHARACTERS.length))
    ).join('');
}

export async function resultAllCategoriesSearch(categName, obj) {
    let result = '';
    for (let i of obj) {
        if (categName.includes(`${i}`)) result = 'true';
        else {
            result = 'false';
            break;
        }
    }
    return result;
}

export async function resultNameCategoriesSearch(categId, categName, request) {
    let result = '';
    for (let i = 0; i < categId.length; i++) {
        const specificCategory = await getResponseHelpSearchAPI(request, `${categId[i]}`, 'category_name');
        if (specificCategory == '') {
            continue;
        } else {
            if ((await resultAllCategoriesSearch(categName[i], specificCategory)).toString()) result = 'true';
            else {
                result = 'false';
                break;
            }
        }
    }
    return result;
}

export async function resultCountCategoriesSearch(page, helpSearchResultsPage) {
    const textButtons = await helpSearchResultsPage.allInnerTextsCategoriesButtons();
    const textButtons1 = [];
    let result = '';
    for (let str of textButtons) {
        textButtons1.push(str.replace('(', '').replace(')', '').split('\n'));
    }
    for (let text of textButtons1) {
        if (text[1] == 0) continue;
        else {
            await page.getByRole('button', { name: `${text[0]}` }).click({ force: true });
            const hText = await helpSearchResultsPage.innerTextsHeaderText();
            if (hText[0].includes(text[1])) result = 'true';
            else {
                result = 'false';
                break;
            }
        }
    }
    return result;
}

export async function resultPageContainQuerySearch(request) {
    const titleSearchPage = await getResponseHelpSearchAPI(request, '', 'title');
    const descriptionTextSearchPage = await getResponseHelpSearchAPI(request, '', 'description_text');
    let result = '';
    if (
        titleSearchPage[0].toLowerCase().includes(`${NAME_SEARCH}`.toLowerCase()) === true ||
        descriptionTextSearchPage[0].toLowerCase().includes(`${NAME_SEARCH}`.toLowerCase()) === true
    ) {
        result = 'true';
    } else result = 'false';
    return result;
}

export async function getNewUserEmail() {
    const [prefixWithSuffix, domain] = process.env.USER_EMAIL.split('@');

    const EMAIL_PREFIX = prefixWithSuffix.split('+')[0] + '+';
    const EMAIL_DOMAIN = '@' + domain;

    return `${EMAIL_PREFIX}${'qa.mail.template1000'}${EMAIL_DOMAIN}`;
}

export async function geNewUserPassword(password) {
    return password.replace(/\d{2}$/, '00');
}
