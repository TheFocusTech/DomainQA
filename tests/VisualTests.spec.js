import { test } from '../fixtures';
import { description, tags, severity, epic, step, issue, tms } from 'allure-js-commons';
import { loginUser } from '../helpers/preconditions';
import { QASE_LINK, URL_ENDPOINT, GOOGLE_DOC_LINK } from '../testData';
import { expect } from '@playwright/test';
import { createHostedZoneAPI, deleteHostedZoneAPI } from '../helpers/apiCalls';
import { getCookies } from '../helpers/utils';

let hostedZoneId;
let headers;

test.describe('Visual tests', () => {
    test.afterEach('Delete created hosted zones via API', async ({ request }) => {
        await deleteHostedZoneAPI(request, hostedZoneId, headers);
    });

    test.beforeEach(async ({ page, headerComponent, loginPage, request }) => {
        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await step('Create hosted zones via API.', async () => {
            headers = await getCookies(page);
            const response = await createHostedZoneAPI(request, headers);
            hostedZoneId = response.id;

            await page.goto(`${process.env.URL}${URL_ENDPOINT.hostedZones}`, {
                waitUntil: 'networkidle',
            });
        });
    });

    test(`TC_04_13 | Dialog "Create hosted zone".`, async ({ page, hostedZonesPage }) => {
        await tags('Domains', 'Positive');
        await severity('normal');
        await description('Visual tests: Dialog "Create hosted zone"');
        await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}olebddjarwut`, 'ATC_04_13');
        await epic('Domains');

        await step('Open modal "Create hosted zone".', async () => {
            await page.evaluate(() => document.fonts.ready);
            await hostedZonesPage.clickCreateHostedZoneButton();
            await expect(hostedZonesPage.createHostedZoneModal).toBeVisible();
        });

        const dialogText = await hostedZonesPage.createHostedZoneModal.textContent();
        expect(dialogText).toMatchSnapshot('text-create-hosted-zone.txt');
    });

    test(`TC_04_14 | Dialog "Add new DNS-record".`, async ({ page, hostedZonesDetailPage, dnsRecordModal }) => {
        await tags('Domains', 'Positive');
        await severity('normal');
        await description('Visual tests: Dialog "Add new DNS-record"');
        await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}zaxsohyzszv0`, 'ATC_04_14');
        await epic('Domains');

        await page.goto(`${process.env.URL}${URL_ENDPOINT.hostedZones}/${hostedZoneId}`, {
            waitUntil: 'networkidle',
        });

        await step('Open modal "Add new DNS-record".', async () => {
            await page.evaluate(() => document.fonts.ready);
            await hostedZonesDetailPage.clickAddRecordButton();
        });

        await expect(hostedZonesDetailPage.hostedZoneModal).toBeVisible();

        const dialogText = await hostedZonesDetailPage.hostedZoneModal.textContent();
        const onlyStaticNames = dialogText.replace(/api-\d+\.\w+/, '');
        expect(onlyStaticNames).toMatchSnapshot('text-add-new-dns-record.txt');
    });
});
