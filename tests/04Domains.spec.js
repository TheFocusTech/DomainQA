import { test } from '../fixtures';
import { createHostedZoneAPI, deleteHostedZoneAPI, getHostedZonesAPI } from '../helpers/apiCalls';
import { getCookies, getRandomDomainName } from '../helpers/utils';
import { description, tags, severity, epic, step, tms, issue, feature } from 'allure-js-commons';
import { loginUser } from '../helpers/preconditions';
import { deleteAllHostedZones } from '../helpers/postconditions';

import {
    QASE_LINK,
    GOOGLE_DOC_LINK,
    CORRECT_DOMAIN,
    ERROR_DOMAIN,
    URL_ENDPOINT,
    WHOIS_SEARCH_RESULT_TITLES,
    TOAST_MESSAGE,
} from '../testData';
import { expect } from '@playwright/test';

let headers;
let domainNameFirst;
let domainNameSecond;
let hostedZoneCount;
let hostedZoneId;
let dnsObj;

test.describe('Search Hosted Zones', () => {
    test.afterAll(async ({ request }) => {
        await deleteAllHostedZones(request, headers);
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
        await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}5rjp86ma9eyp`, 'ATC_04_02');
        await epic('Domains');
        await feature('Hosted zone search');

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await step('Preconditions: Create hosted zones via API.', async () => {
            headers = await getCookies(page);

            const responseFirst = await createHostedZoneAPI(request, headers);
            domainNameFirst = responseFirst.domain;

            const responseSecond = await createHostedZoneAPI(request, headers);
            domainNameSecond = responseSecond.domain;

            const getZonesData = await getHostedZonesAPI(request, headers);
            hostedZoneCount = getZonesData.meta.total;
        });

        await hostedZonesPage.open();
        await hostedZonesPage.waitForHostedZoneIsVisible(domainNameFirst);
        await hostedZonesPage.waitForHostedZoneIsVisible(domainNameSecond);

        await step('Search by exact name - the only zone is displayed.', async () => {
            await hostedZonesPage.performSearch(domainNameFirst);

            const names = await hostedZonesPage.getNames();
            expect(names).toEqual([domainNameFirst]);
        });

        await step('Search by partial name - both created zones are displayed.', async () => {
            await hostedZonesPage.performSearch('api');

            await hostedZonesPage.waitForHostedZoneIsVisible(domainNameFirst);
            await hostedZonesPage.waitForHostedZoneIsVisible(domainNameSecond);
        });

        await step('Clear search - all zones are displayed.', async () => {
            await hostedZonesPage.clearSearch();

            const zonesCount = await hostedZonesPage.hostedZones.count();
            expect(zonesCount).toBe(hostedZoneCount);
        });

        await step('Validate search returns no results.', async () => {
            const randomName = await getRandomDomainName();

            await hostedZonesPage.performSearch(randomName);

            const zonesCount = await hostedZonesPage.hostedZones.count();

            expect(zonesCount).toBe(0);
            await expect(hostedZonesPage.noResultsText).toBeVisible();
        });
    });
});

test.describe('DNS Records', () => {
    test.afterEach('Postconditions: Delete created hosted zones via API', async ({ request }) => {
        await deleteHostedZoneAPI(request, hostedZoneId, headers);
    });

    test.beforeEach(async ({ page, headerComponent, loginPage, hostedZonesDetailPage, request }) => {
        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await step('Preconditions: Create hosted zones via API.', async () => {
            headers = await getCookies(page);
            const response = await createHostedZoneAPI(request, headers);
            hostedZoneId = response.id;

            await page.goto(`${process.env.URL}${URL_ENDPOINT.hostedZones}/${hostedZoneId}`, {
                waitUntil: 'networkidle',
            });
        });

        await step('Open modal "Add new DNS-record".', async () => {
            await hostedZonesDetailPage.clickAddRecordButton();
        });
    });

    test('TC_04_11 | "Add new DNS-record modal - verify copy button adds text to clipboard.', async ({
        page,
        dnsRecordModal,
    }) => {
        await tags('Domains', 'Positive');
        await severity('normal');
        await description('Verify copy button works properly.');
        await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}8qehz9q2sggw`, 'ATC_04_11');
        await epic('Domains');

        await step('Verify "Add new DNS-record" modal is visible.', async () => {
            await expect(dnsRecordModal.dialog).toBeVisible();
        });

        await step('Click copy button', async () => {
            await dnsRecordModal.copyButton.click();
        });

        await step('Read text from clipboard and validate.', async () => {
            const copiedText = await page.evaluate('navigator.clipboard.readText()');
            expect(await dnsRecordModal.getRootDomainName()).toEqual(copiedText);
        });
    });

    test('TC_04_12 | "Add new DNS-record modal - verify info tooltip appeared.', async ({ dnsRecordModal }) => {
        await tags('Domains', 'Positive');
        await severity('normal');
        await description('Verify copy button works properly.');
        await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}qsuvt3qz7wup`, 'ATC_04_12');
        await epic('Domains');

        await step('Verify "Add new DNS-record" modal is visible.', async () => {
            await expect(dnsRecordModal.dialog).toBeVisible();
        });

        await step('Hover info icon', async () => {
            await dnsRecordModal.infoIcon.hover();
        });

        await step('Verify info tooltip appeared.', async () => {
            await expect(dnsRecordModal.tooltip).toBeVisible();
        });
    });

    test('TC_04_10 | "Add new DNS-record" modal was closed by Cancel or by X button', async ({
        hostedZonesDetailPage,
        dnsRecordModal,
    }) => {
        await tags('Domains', 'Positive');
        await severity('normal');
        await description('Verify DNS Record with required fields');
        await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}2tly5p2ks4km`, 'ATC_04_10');
        await epic('Domains');

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

    [
        { dnsType: 'A' },
        { dnsType: 'AAAA' },
        { dnsType: 'CNAME' },
        { dnsType: 'DS' },
        { dnsType: 'MX' },
        { dnsType: 'NS' },
        { dnsType: 'TXT' },
    ].forEach(({ dnsType }) => {
        test(`TC_04_04 | "Hosted zones - DNS Record - Create with all fields ${dnsType}`, async ({
            hostedZonesDetailPage,
            dnsRecordModal,
        }) => {
            await tags('Domains', 'Positive');
            await severity('normal');
            await description('Verify DNS Record created with all fields.');
            await issue(`${QASE_LINK}suite=3&case=7`, 'Hosted-Zones');
            await tms(`${GOOGLE_DOC_LINK}kgnoic8i621f`, 'ATC_04_04');
            await epic('Domains');

            await step(`Fill form for ${dnsType}`, async () => {
                dnsObj = await dnsRecordModal.fillForm(dnsType);
            });

            await step('Save "Add new DNS-record".', async () => {
                await dnsRecordModal.clickSaveButton();
            });

            await step('Verify "Add new DNS-record" modal is not visible.', async () => {
                await expect(hostedZonesDetailPage.hostedZoneModal).not.toBeVisible();
            });

            await step('Verify record appeared in the "DNS Management" card.', async () => {
                const dnsResords = await hostedZonesDetailPage.getDnsRecords();
                const foundRecord = dnsResords.find((obj) => {
                    return (
                        obj.type === dnsType &&
                        obj.name === dnsObj.name &&
                        obj.content === dnsObj.content &&
                        obj.ttl === dnsObj.ttl
                    );
                });
                expect(foundRecord).toBeDefined();
            });
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

test.describe('DNSSEC', () => {
    test.beforeEach(async ({ page, headerComponent, loginPage, hostedZonesPage, request }) => {
        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        headers = await getCookies(page);
        const response = await createHostedZoneAPI(request, headers);
        const domainName = response.domain;

        await hostedZonesPage.open();

        await step(`Navigate to Hosted Zone ${domainName} page.`, async () => {
            await hostedZonesPage.clickOnHostedZoneName(domainName);
        });
    });

    test.afterAll(async ({ request }) => {
        await deleteAllHostedZones(request, headers);
    });

    test('TC_04_08 | Verify user can enable DNSSEC', async ({
        page,
        enableDnssecModal,
        hostedZonesDetailPage,
        toastComponent,
    }) => {
        await tags('Domains', 'DNSSEC', 'Positive');
        await severity('normal');
        await description('To verify DNSSEC can be enabled');
        await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}gu0m5ch4yg2x`, 'ATC_04_08');
        await epic('Domains');

        await page.waitForSelector('button:has-text("Enable DNSSEC")', { state: 'visible' });

        await step('Validate "DNSSEC" card UI.', async () => {
            await hostedZonesDetailPage.dnssecCardHeader.waitFor({ state: 'visible' });
            await expect(hostedZonesDetailPage.dnssecDescription).toBeVisible();
            await expect(hostedZonesDetailPage.notUsingDnssecWarning).toBeVisible();
        });

        await hostedZonesDetailPage.enableDnssecBtn.click();

        await step('Validate "Enable DNSSEC" modal UI.', async () => {
            await expect(enableDnssecModal.dialog).toBeVisible();
            await expect(enableDnssecModal.title).toBeVisible();
            await expect(enableDnssecModal.title).toHaveText('Enable DNSSEC');
            await expect(enableDnssecModal.descriptionModal).toBeVisible();
            await expect(enableDnssecModal.descriptionModal).toHaveText(
                'Domain Name System Security Extensions (DNSSEC) protect from threats like DNS cache poisoning attacks and DNS spoofing.'
            );
            await expect(enableDnssecModal.cancelBtn).toBeVisible();
            await expect(enableDnssecModal.enableBtn).toBeVisible();
            await expect(enableDnssecModal.closeBtn).toBeVisible();
        });

        await enableDnssecModal.closeModalRandomly();

        await step('Verify that "Enable DNSSEC" modal is not visible.', async () => {
            await expect(enableDnssecModal.dialog).not.toBeVisible();
        });

        await hostedZonesDetailPage.clickEnableDnssecBtn();
        await enableDnssecModal.clickEnableBtn();

        await step('Verify the activation warning is visible.', async () => {
            await hostedZonesDetailPage.dnssecActivationWarning.waitFor({ state: 'visible' });
        });

        await step('Verify the toast message "DNSSEC enabled" appears.', async () => {
            await expect(toastComponent.toastBody).toBeVisible();
            await expect(toastComponent.toastBody).toHaveText(TOAST_MESSAGE.dnssecEnabled);
        });
    });
});
