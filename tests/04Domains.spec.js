import { test } from '../fixtures';
import { createHostedZoneAPI, deleteHostedZoneAPI, getHostedZonesAPI } from '../helpers/apiCalls';
import { getCookies } from '../helpers/utils';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { loginUser, createHostedZone, deleteHostedZone } from '../helpers/preconditions';
import { QASE_LINK, GOOGLE_DOC_LINK, HOSTED_ZONE_DOMAIN_NAME, URL_ENDPOINT } from '../testData';
import { expect } from '@playwright/test';
let headers;
let newHostedZoneId;
let domainName;
let hostedZoneCount;

test.describe('Domains', () => {
    test.beforeEach(async ({ page, headerComponent, loginPage, hostedZonesPage, createHostedZoneModal }) => {
        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);
        await createHostedZone(page, hostedZonesPage, createHostedZoneModal);

        await step(`Navigate to Hosted Zones/Management for ${HOSTED_ZONE_DOMAIN_NAME}`, async () => {
            await hostedZonesPage.clickOnHostedZoneName(HOSTED_ZONE_DOMAIN_NAME);
        });
    });

    test('TC_04_10 | "Add new DNS-record" modal was closed by Cancel or by X button', async ({
        hostedZonesDetailPage,
        dnsRecordModal,
    }) => {
        await tags('Domains', 'Positive');
        await severity('normal');
        await description('Verify DNS Record with required fields');
        await issue(`${QASE_LINK}suite=3&case=7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}2tly5p2ks4km`, 'ATC_04_10');
        await epic('Domains');

        await step('Open modal "Add new DNS-record".', async () => {
            await hostedZonesDetailPage.clickAddRecordButton();
        });

        await step('Verify "Add new DNS-record" modal is visible.', async () => {
            await expect(hostedZonesDetailPage.hostedZoneModal).toBeVisible();
        });

        await step('Close "Add new DNS-record" by clicking Cancel.', async () => {
            await dnsRecordModal.clickCancelButton();
        });

        await step('Verify "Add new DNS-record" modal is not visible.', async () => {
            await expect(hostedZonesDetailPage.hostedZoneModal).not.toBeVisible();
        });

        await step('Open "Add new DNS-record" modal.', async () => {
            await hostedZonesDetailPage.clickAddRecordButton();
        });

        await step('Close dialog by clicking "X".', async () => {
            await dnsRecordModal.clickXButton();
        });

        await step('Verify "Add new DNS-record" modal is not visible.', async () => {
            await expect(hostedZonesDetailPage.hostedZoneModal).not.toBeVisible();
        });
    });

    test.afterEach(async ({ hostedZonesPage, hostedZonesDetailPage, deleteHostedZoneModal }) => {
        await step(`Delete hosted zone after usage.`, async () => {
            await hostedZonesDetailPage.clickBackToHostedZonesButton();
            await deleteHostedZone(hostedZonesPage, deleteHostedZoneModal);
        });
    });

    test.skip('TC_04_02 | Verify search by hosted zone name.', async ({
        page,
        request,
        homePage,
        loginPage,
        hostedZonesPage,
    }) => {
        await step('Preconditions: Login as a registered user', async () => {
            await loginUser(page, homePage, loginPage);
            await page.waitForURL(process.env.URL);
        });

        await step('Preconditions: Create hosted zone via API.', async () => {
            headers = await getCookies(page);

            const createdHostedZoneResponse = await createHostedZoneAPI(request, headers);
            newHostedZoneId = createdHostedZoneResponse.id;
            domainName = createdHostedZoneResponse.domain;

            hostedZoneCount = await getHostedZonesAPI(request, headers);

            await page.goto(URL_ENDPOINT.hostedZones);
        });

        await hostedZonesPage.waitForHostedZoneIsVisible(domainName);

        await step('Postconditions: Delete hosted zone via API.', async () => {
            await deleteHostedZoneAPI(request, newHostedZoneId, headers);

            const hostedZoneCountAfter = await getHostedZonesAPI(request, headers);

            expect(hostedZoneCountAfter).toEqual(hostedZoneCount - 1);
        });
    });
});
