import { test } from '../fixtures';
import { description, tags, severity, epic, step, issue } from 'allure-js-commons';
import { loginUser } from '../helpers/preconditions';
import { QASE_LINK, URL_ENDPOINT } from '../testData';
import { expect } from '@playwright/test';
import { createHostedZoneAPI, deleteHostedZoneAPI } from '../helpers/apiCalls';
import { getCookies } from '../helpers/utils';

let hostedZoneId;
let headers;

test.describe('Visual tests', () => {
    test.afterEach('Postconditions: Delete created hosted zones via API', async ({ request }) => {
        await deleteHostedZoneAPI(request, hostedZoneId, headers);
    });

    test.beforeEach(async ({ page, headerComponent, loginPage, request }) => {
        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await step('Preconditions: Create hosted zones via API.', async () => {
            headers = await getCookies(page);
            const response = await createHostedZoneAPI(request, headers);
            hostedZoneId = response.id;

            await page.goto(`${process.env.URL}${URL_ENDPOINT.hostedZones}`, {
                waitUntil: 'networkidle',
            });
        });
    });

    test(`Dialog "Create hosted zone".`, async ({ page, hostedZonesPage }) => {
        await tags('Domains', 'Positive');
        await severity('normal');
        await description('Verify all text displayed correct');
        await issue(`${QASE_LINK}suite=3&case=7`, 'Hosted-Zones');
        await epic('Domains');

        await page.goto(`${process.env.URL}${URL_ENDPOINT.hostedZones}`, {
            waitUntil: 'networkidle',
        });

        await step('Open modal "Create hosted zone".', async () => {
            await hostedZonesPage.clickCreateHostedZoneButton();
            await expect(hostedZonesPage.createHostedZoneModal).toBeVisible();
        });
        await expect(hostedZonesPage.createHostedZoneModal).toHaveScreenshot({ omitBackground: true });
    });

    test(`Dialog "Add new DNS-record".`, async ({ page, hostedZonesDetailPage }) => {
        await tags('Domains', 'Positive');
        await severity('normal');
        await description('Verify all text displayed correct');
        await issue(`${QASE_LINK}suite=3&case=7`, 'Hosted-Zones');
        await epic('Domains');

        await page.goto(`${process.env.URL}${URL_ENDPOINT.hostedZones}/${hostedZoneId}`, {
            waitUntil: 'networkidle',
        });

        await step('Open modal "Add new DNS-record".', async () => {
            await hostedZonesDetailPage.clickAddRecordButton();
        });

        const sensitiveElement = page.locator('[class*="create-form_body__description-outer__"]');
        await expect(hostedZonesDetailPage.dnsZoneModal).toBeVisible();
        await expect(hostedZonesDetailPage.dnsZoneModal).toHaveScreenshot({
            omitBackground: true,
            mask: [sensitiveElement],
            maskColor: '#FF00FF',
        });
    });
});
