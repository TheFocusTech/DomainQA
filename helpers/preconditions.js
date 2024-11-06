import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';
import { HOSTED_ZONE_DOMAIN_NAME, URL_ENDPOINT, NAME_SEARCH } from '../testData';

export const loginUser = async (page, headerComponent, loginPage) => {
    await step('Preconditions: Login as a registered user', async () => {
        await page.goto('/');
        await headerComponent.clickLogin();
        await loginPage.fillEmailAddressInput(process.env.USER_EMAIL);
        await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
        await loginPage.clickLogin();
    });
};

export const createHostedZone = async (page, hostedZonesPage, createHostedZoneModal) => {
    await step('Create Hosted Zones.', async () => {
        await page.goto(`${process.env.URL}${URL_ENDPOINT.hostedZones}`, {
            waitUntil: 'networkidle',
        });
        await hostedZonesPage.clickCreateHostedZoneButton();
        await expect(createHostedZoneModal.hostedZoneDomainNameInput).toBeVisible();
        await createHostedZoneModal.fillHostedZoneDomainNameInput(HOSTED_ZONE_DOMAIN_NAME);
        await createHostedZoneModal.clickCreateButton();
    });
};

export const deleteHostedZone = async (hostedZonesPage, deleteHostedZoneModal) => {
    await step('Delete Hosted Zone.', async () => {
        await hostedZonesPage.clickBreadcrumbMenuHostedZone();
        await hostedZonesPage.clickDeleteButton();
        await deleteHostedZoneModal.clickDeleteButton();
        await expect(hostedZonesPage.deleteHostedZoneModal).not.toBeVisible();
    });
};

export const goToHelpSearchResultsPage = async (page, headerComponent, helpCenterPage) => {
    await headerComponent.clickHelpCenterButton();
    await helpCenterPage.fillSearchTermPlaceholder(`${NAME_SEARCH}`);    
    await helpCenterPage.clickHelpCenterSearchButton();
    // await page.goto(`${process.env.URL}/help/search?search=${NAME_SEARCH}`); 
};