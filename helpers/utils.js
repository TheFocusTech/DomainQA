import { TOTP } from 'totp-generator';
import { RANDOM_CHARACTERS } from '../testData';

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
   
export async function getResultVerifySearchAPI(categName, obj) {
    let result = '';    
    for (let i of obj) {          
        (categName.includes(`${i}`))? (result = 'true'): (result = 'false');
    }
    console.log(result);
    return result;
}