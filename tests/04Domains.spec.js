import { test } from '../fixtures';
import { createHostedZoneAPI, deleteHostedZoneAPI, getHostedZonesAPI } from '../helpers/apiCalls';
import { getCookies, getRandomDomainName } from '../helpers/utils';
import { description, tags, severity, epic, step, tms, issue, feature } from 'allure-js-commons';
import { loginUser, createHostedZone, deleteHostedZone } from '../helpers/preconditions';
import {
    QASE_LINK,
    GOOGLE_DOC_LINK,
    HOSTED_ZONE_DOMAIN_NAME,
    CORRECT_DOMAIN,
    ERROR_DOMAIN,
    WHOIS_SEARCH_RESULT_TITLES,
    TOAST_MESSAGE,
} from '../testData';
import { expect } from '@playwright/test';
let headers;
let hostedZoneId1;
let domainName1;
let hostedZoneId2;
let domainName2;
let hostedZoneCount;

test.describe('Search Hosted Zones', () => {
    test.afterAll('Postconditions: Delete created hosted zones via API', async ({ request }) => {
        await deleteHostedZoneAPI(request, hostedZoneId1, headers);
        await deleteHostedZoneAPI(request, hostedZoneId2, headers);

        const hostedZoneCountAfter = await getHostedZonesAPI(request, headers);
        expect(hostedZoneCountAfter).toEqual(hostedZoneCount - 2);
    });

    test('TC_04_02 | Verify search by hosted zone name', async ({
        page,
        request,
        headerComponent,
        loginPage,
        hostedZonesPage,
    }) => {
        await tags('Domains', 'Search');
        await severity('normal');
        await description('To verify, that user is able to search a hosted zone by name');
        await issue(`${QASE_LINK}case=7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}5rjp86ma9eyp`, 'ATC_04_02');
        await epic('Domains');
        await feature('Hosted zone search');

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await step('Preconditions: Create hosted zones via API.', async () => {
            headers = await getCookies(page);

            const res1 = await createHostedZoneAPI(request, headers);
            hostedZoneId1 = res1.id;
            domainName1 = res1.domain;

            const res2 = await createHostedZoneAPI(request, headers);
            hostedZoneId2 = res2.id;
            domainName2 = res2.domain;

            hostedZoneCount = await getHostedZonesAPI(request, headers);
        });

        await hostedZonesPage.open();
        await hostedZonesPage.waitForHostedZoneIsVisible(domainName1);
        await hostedZonesPage.waitForHostedZoneIsVisible(domainName2);

        await step('Search by partial name - both created zones are displayed.', async () => {
            await hostedZonesPage.performSearch('api');

            await hostedZonesPage.waitForHostedZoneIsVisible(domainName1);
            await hostedZonesPage.waitForHostedZoneIsVisible(domainName2);
        });

        await step('Search by exact name - the only zone is displayed.', async () => {
            await hostedZonesPage.performSearch(domainName1);

            const names = await hostedZonesPage.getNames();
            expect(names).toEqual([domainName1]);
        });

        await step('Clear search - all zones are displayed', async () => {
            await hostedZonesPage.clearSearch();

            const zonesCount = await hostedZonesPage.hostedZones.count();
            expect(zonesCount).toBe(hostedZoneCount);
        });

        await step('Validate search returns no results', async () => {
            const randomName = await getRandomDomainName();

            await hostedZonesPage.performSearch(randomName);

            const zonesCount = await hostedZonesPage.hostedZones.count();

            expect(zonesCount).toBe(0);
            await expect(hostedZonesPage.noResultsText).toBeVisible();
        });
    });
});

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

test.describe('Hosted zones', () => {
    test('TC_04_02 | Verify user can create hosted zone, navigate and delete', async ({
        page,
        loginPage,
        headerComponent,
        createHostedZoneModal,
        hostedZonesPage,
        toastComponent,
        deleteHostedZoneModal,
    }) => {
        await tags('Domains', 'Hosted Zones');
        await severity('normal');
        await description('To verify, that user is able to create hosted zone, navigate and delete');
        await issue(`${QASE_LINK}/01-`, 'Hosted Zones');
        await tms(`${GOOGLE_DOC_LINK}`, 'ATC_04_02');
        await epic('Domains');
        await feature('Hosted Zones');

        await loginUser(page, headerComponent, loginPage, createHostedZoneModal);

        await step('Create Hosted Zones.', async () => {
            await headerComponent.clickHostedZonesLink();
        });
        await step('Verify that the user is in the Hosted Zone Page', async () => {
            await hostedZonesPage.hostedZonesHeader.isVisible();
        });

        await hostedZonesPage.clickCreateHostedZoneButton();

        await expect(createHostedZoneModal.hostedZoneDomainNameInput).toBeVisible();

        await createHostedZoneModal.fillHostedZoneDomainNameInput(HOSTED_ZONE_DOMAIN_NAME);
        await createHostedZoneModal.clickCreateButton();

        await step('Verify toast notification about successful creation of hosted zone.', async () => {
            await toastComponent.toastBody.waitFor({ state: 'visible' });
            await expect(toastComponent.toastBody).toHaveText(TOAST_MESSAGE.hostedZoneCreated);
        });

        await step('Verify the creation of the Hosted Zone', async () => {
            await hostedZonesPage.hostedZonesHeader.isVisible();
            await hostedZonesPage.createdHostedZoneTitle.isVisible();
        });

        await hostedZonesPage.clickBreadcrumbMenuHostedZone();
        await hostedZonesPage.clickDeleteButton();
        await deleteHostedZoneModal.clickDeleteButton();
        await expect(hostedZonesPage.deleteHostedZoneModal).not.toBeVisible();
    });
});
