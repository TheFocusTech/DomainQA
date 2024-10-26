import { step } from 'allure-js-commons';

export const loginUser = async (page, headerComponent, loginPage) => {
    await step('Login as a registered user', async () => {
        await page.goto('/');
        await headerComponent.clickLogin();
        await loginPage.fillEmailAddressInput(process.env.USER_EMAIL);
        await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
        await loginPage.clickLogin();
    });
};
