import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';

export const loginUser = async ( page, homePage, loginPage ) => {
await step('Login as a registered user', async () => {
    await page.goto('/');
    await homePage.clickLogin();
    await loginPage.fillEmailAddressInput(process.env.USER_EMAIL);
    await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
    await loginPage.clickLogin();
    });
}