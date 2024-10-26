import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';
import { HOSTED_ZONE_DOMAIN_NAME, URL_ENDPOINT } from '../testData';

export const loginUser = async (page, homePage, loginPage) => {
    await step('Login as a registered user', async () => {
        await page.goto('/');
        await homePage.clickLogin();
        await loginPage.fillEmailAddressInput(process.env.USER_EMAIL);
        await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
        await loginPage.clickLogin();
    });
};

export const createHostedZone = async (page, hostedZonesPage, createHostedZoneModal) => {
    await step('Create Hosted Zones.', async () => {
        await page.goto(`${process.env.URL}${URL_ENDPOINT.hostedZonesManagement}`, {
            waitUntil: 'networkidle',
        });
        await hostedZonesPage.clickCreateHostedZoneButton();
        await expect(createHostedZoneModal.hostedZoneDomainNameInput).toBeVisible();
        await createHostedZoneModal.fillHostedZoneDomainNameInput(HOSTED_ZONE_DOMAIN_NAME);
        await createHostedZoneModal.clickCreateButton();
    });
};
