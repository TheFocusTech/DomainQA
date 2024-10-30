import { test } from '../fixtures';
import { createHostedZoneAPI, deleteHostedZoneAPI, getHostedZonesAPI } from '../helpers/apiCalls';
import { getCookies } from '../helpers/utils';
import { description, tags, severity, epic, step, tms, issue, feature } from 'allure-js-commons';
import { loginUser, createHostedZone, deleteHostedZone } from '../helpers/preconditions';
import {
    QASE_LINK,
    GOOGLE_DOC_LINK,
    HOSTED_ZONE_DOMAIN_NAME,
    URL_ENDPOINT,
    CORRECT_DOMAIN,
    ERROR_DOMAIN,
    WHOIS_SEARCH_RESULT_TITLES,
} from '../testData';
import { expect } from '@playwright/test';
let headers;
let newHostedZoneId;
let domainName;
let hostedZoneCount;

test.describe('DNS Records', () => {
    test.beforeEach(async ({ page, headerComponent, loginPage, hostedZonesPage, createHostedZoneModal }) => {
        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);
        await createHostedZone(page, hostedZonesPage, createHostedZoneModal);

        await step(`Navigate to Hosted Zones/Management for ${HOSTED_ZONE_DOMAIN_NAME}`, async () => {
            await hostedZonesPage.clickOnHostedZoneName(HOSTED_ZONE_DOMAIN_NAME);
        });
    });

    test.skip('TC_04_10 | "Add new DNS-record" modal was closed by Cancel or by X button', async ({
        hostedZonesDetailPage,
        dnsRecordModal,
    }) => {
        await tags('Domains', 'Positive');
        await severity('normal');
        await description('Verify DNS Record with required fields');
        await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
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

test.describe('Search domains', () => {
    test('TC_04_09_01 | Verify user can search the registered domain', async ({
        page,
        loginPage,
        whoisPage,
        headerComponent,
        whoisSearchResultPage,
    }) => {
        await tags('Domains', 'WhoIs');
        await severity('normal');
        await description('To verify, that user is able to search the registered domain in WhoIs');
        await issue(`${QASE_LINK}/01-9`, 'WHOIS');
        await tms(`${GOOGLE_DOC_LINK}txgklyjggrmv`, 'ATC_04_09_01');
        await epic('Domains');
        await feature('Search registered domain');

        await loginUser(page, headerComponent, loginPage);

        await headerComponent.clickDomainsButton();
        await headerComponent.clickWhoisButton();
        await whoisPage.fillWhoisSearchInput(CORRECT_DOMAIN);
        await whoisPage.clickWhoisSearchButton();

        await step('Verify that title "WHOIS Search results" is appears', async () => {
            await whoisSearchResultPage.resultTitle.isVisible();
        });

        await step('Verify that info about domain (name of domain and titles) is appears', async () => {
            await expect(whoisSearchResultPage.resultSearch).toContainText(CORRECT_DOMAIN);
            for (const title of WHOIS_SEARCH_RESULT_TITLES) {
                await expect(whoisSearchResultPage.resultSearch).toContainText(title);
            }
        });
    });

    test('TC_04_09_02 | Verify user can search the non-registered domain in Whois page', async ({
        page,
        loginPage,
        whoisSearchResultPage,
        headerComponent,
        whoisPage,
    }) => {
        await tags('Domains', 'WhoIs');
        await severity('normal');
        await description('To verify that user is able to search the non-registered domain in WhoIs');
        await issue(`${QASE_LINK}/01-9`, 'Whois');
        await tms(`${GOOGLE_DOC_LINK}xsk1f76ggd2o`, 'ATC_04_09_02');
        await epic('Domains');
        await feature('Search non-registered domain');

        await loginUser(page, headerComponent, loginPage);

        await headerComponent.clickDomainsButton();
        await headerComponent.clickWhoisButton();
        await whoisPage.fillWhoisSearchInput(ERROR_DOMAIN);
        await whoisPage.clickWhoisSearchButton();

        await step('Verify that title "WHOIS Search results" is appears', async () => {
            await whoisSearchResultPage.resultTitle.isVisible();
        });
        await step('Verify that info that no match is appears', async () => {
            await whoisSearchResultPage.noMatchText.isVisible();
        });
    });
});
