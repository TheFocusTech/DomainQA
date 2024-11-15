import { test } from '../fixtures';
import { expect } from '@playwright/test';
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
    MODAL_WINDOW_DELETE_HOSTED_ZONE,
} from '../testData';

let headers;
let domainNameFirst;
let domainNameSecond;
let hostedZoneCount;
let hostedZoneId;
let dnsObj;
let dnsRecordsBeforeEdit;

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

            await page.waitForTimeout(1000);

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
    test.afterAll(async ({ request }) => {
        await deleteAllHostedZones(request, headers);
    });

    test('TC_04_03_02 | Verify user can delete hosted zone', async ({
        page,
        loginPage,
        headerComponent,
        createHostedZoneModal,
        hostedZonesPage,
        toastComponent,
        deleteHostedZoneModal,
        request,
    }) => {
        await tags('Domains', 'Hosted Zones');
        await severity('normal');
        await description('To verify, that user is able to delete hosted zone');
        await issue(`${QASE_LINK}/01-7`, 'Hosted Zones');
        await tms(`${GOOGLE_DOC_LINK}mftezseekpm`, 'ATC_04_03_02');
        await epic('Domains');
        await feature('Hosted Zones');

        let domainName;

        await loginUser(page, headerComponent, loginPage, createHostedZoneModal);
        await page.waitForURL(process.env.URL);

        await step('Preconditions: Create hosted zones via API.', async () => {
            headers = await getCookies(page);

            const response = await createHostedZoneAPI(request, headers);
            domainName = response.domain;
        });

        await hostedZonesPage.open();

        await hostedZonesPage.clickBreadcrumbMenuHostedZone();
        await hostedZonesPage.clickDeleteButton();

        const textFormModalWindow = await deleteHostedZoneModal.formModalWindow.textContent();
        MODAL_WINDOW_DELETE_HOSTED_ZONE.forEach((expectedText) => {
            expect(textFormModalWindow).toContain(expectedText);
        });

        expect(textFormModalWindow).toContain(domainName);

        await deleteHostedZoneModal.clickCancelButton();
        await hostedZonesPage.clickBreadcrumbMenuHostedZone();
        await hostedZonesPage.clickDeleteButton();

        await deleteHostedZoneModal.clickDeleteButton();

        await step('Verify toast notification about successful deletion of hosted zone.', async () => {
            await expect(toastComponent.toastBody).toHaveText(TOAST_MESSAGE.hostedZoneDeleted);
        });

        await step('Verify that deleted hosted zone is not available in the Hosted Zones Page', async () => {
            await hostedZonesPage.hostedZonesHeader.isVisible();

            hostedZonesPage.setCreatedHostedZoneTitleLocator(domainName);
            await expect(hostedZonesPage.createdHostedZoneTitle).not.toBeVisible();
        });
    });

    test('TC_04_02 | Verify user can create hosted zone', async ({
        page,
        loginPage,
        headerComponent,
        createHostedZoneModal,
        hostedZonesPage,
        toastComponent,
        hostedZonesDetailPage,
    }) => {
        await tags('Domains', 'Hosted Zones');
        await severity('normal');
        await description('To verify, that user is able to create hosted zone');
        await issue(`${QASE_LINK}/01-7`, 'Hosted Zones');
        await tms(`${GOOGLE_DOC_LINK}3snf2ukx9ybc`, 'ATC_04_03_01');
        await epic('Domains');
        await feature('Hosted Zones');

        const domainName = await getRandomDomainName();

        await loginUser(page, headerComponent, loginPage, createHostedZoneModal);
        await page.waitForURL(process.env.URL);
        headers = await getCookies(page);

        await hostedZonesPage.open();
        await hostedZonesPage.clickCreateHostedZoneButton();

        await step('Verify that the Modal Window to create Hosted Zone Page is opening', async () => {
            await expect(createHostedZoneModal.hostedZoneDomainNameInput).toBeVisible();
        });

        await createHostedZoneModal.fillHostedZoneDomainNameInput(domainName);

        await createHostedZoneModal.clickCancelButton();

        await hostedZonesPage.clickCreateHostedZoneButton();
        await createHostedZoneModal.fillHostedZoneDomainNameInput(domainName);
        await createHostedZoneModal.clickCreateButton();

        await step('Verify toast notification about successful creation of hosted zone.', async () => {
            await expect(toastComponent.promptHZCreated).toBeVisible();
        });

        await step('Verify that the new Hosted Zone page appears', async () => {
            await hostedZonesPage.waitForHostedZoneNewCreatedName(domainName);
            await expect(hostedZonesDetailPage.hostedZonesDetailTitle).toBeVisible();
            await expect(hostedZonesDetailPage.hostedZonesDetailTitle).toContainText('Hosted zone');
            await expect(hostedZonesDetailPage.hostedZonesDetailTitle).toContainText(domainName);
        });

        await step(
            'Verify that the user can back to the page with Hosted Zones if click the button to return back',
            async () => {
                await hostedZonesDetailPage.clickBackToHostedZonesButton();
                await expect(hostedZonesPage.hostedZonesHeader).toBeVisible();
            }
        );
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

test.describe('DNS Records', () => {
    const arrDnsTypes = [
        { dnsType: 'A' },
        { dnsType: 'AAAA' },
        { dnsType: 'CNAME' },
        { dnsType: 'DS' },
        { dnsType: 'MX' },
        { dnsType: 'NS' },
        { dnsType: 'TXT' },
    ];

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

            await page.goto(`${process.env.URL}${URL_ENDPOINT.hostedZones}/${hostedZoneId}`, {
                waitUntil: 'networkidle',
            });
        });
    });

    test('TC_04_11 | "Add new DNS-record modal - verify copy button adds text to clipboard.', async ({
        page,
        dnsRecordModal,
        hostedZonesDetailPage,
    }) => {
        await tags('Domains', 'Positive');
        await severity('normal');
        await description('Verify copy button works properly.');
        await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}8qehz9q2sggw`, 'ATC_04_11');
        await epic('Domains');

        await step('Open modal "Add new DNS-record".', async () => {
            await hostedZonesDetailPage.clickAddRecordButton();
        });

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

    test('TC_04_12 | "Add new DNS-record modal - verify info tooltip appeared.', async ({
        dnsRecordModal,
        hostedZonesDetailPage,
    }) => {
        await tags('Domains', 'Positive');
        await severity('normal');
        await description('Verify copy button works properly.');
        await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}qsuvt3qz7wup`, 'ATC_04_12');
        await epic('Domains');

        await step('Open modal "Add new DNS-record".', async () => {
            await hostedZonesDetailPage.clickAddRecordButton();
        });

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

    arrDnsTypes.forEach(({ dnsType }) => {
        test(`TC_04_04 | "Hosted zones - DNS Record - Create with all fields ${dnsType}`, async ({
            hostedZonesDetailPage,
            dnsRecordModal,
        }) => {
            await tags('Domains', 'Positive');
            await severity('normal');
            await description('Verify DNS Record created with all fields.');
            await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
            await tms(`${GOOGLE_DOC_LINK}kgnoic8i621f`, 'ATC_04_04');
            await epic('Domains');

            await step('Open modal "Add new DNS-record".', async () => {
                await hostedZonesDetailPage.clickAddRecordButton();
            });

            await step(`Fill form for ${dnsType}`, async () => {
                dnsObj = await dnsRecordModal.fillForm(dnsType, true);
            });

            await step('Save "Add new DNS-record".', async () => {
                await dnsRecordModal.clickSaveButton();
            });

            await step('Verify "Add new DNS-record" modal is not visible.', async () => {
                await expect(hostedZonesDetailPage.hostedZoneModal).not.toBeVisible();
            });

            await step('Verify record appeared in the "DNS Management" card.', async () => {
                expect(await hostedZonesDetailPage.findAddedRecord(dnsType, dnsObj)).toBeDefined();
            });
        });
    });

    arrDnsTypes.forEach(({ dnsType }) => {
        test(`TC_04_05 | "Hosted zones - DNS Record - Create with required fields ${dnsType}. Ignored optional fields`, async ({
            hostedZonesDetailPage,
            dnsRecordModal,
        }) => {
            await tags('Domains', 'Positive');
            await severity('normal');
            await description('Verify DNS Record with required fields.');
            await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
            await tms(`${GOOGLE_DOC_LINK}sxsiip4o92ch`, 'ATC_04_05');
            await epic('Domains');

            await step('Open modal "Add new DNS-record".', async () => {
                await hostedZonesDetailPage.clickAddRecordButton();
            });

            await step(`Fill form for ${dnsType}`, async () => {
                dnsObj = await dnsRecordModal.fillForm(dnsType, false);
            });

            await step('Save "Add new DNS-record".', async () => {
                await dnsRecordModal.clickSaveButton();
            });

            await step('Verify "Add new DNS-record" modal is not visible.', async () => {
                await expect(hostedZonesDetailPage.hostedZoneModal).not.toBeVisible();
            });

            await step('Verify record appeared in the "DNS Management" card.', async () => {
                expect(await hostedZonesDetailPage.findAddedRecord(dnsType, dnsObj)).toBeDefined();
            });
        });
    });

    test(`TC_04_06 | Verify user can edit DNS record in hosted zone`, async ({
        hostedZonesDetailPage,
        dnsRecordModal,
    }) => {
        await tags('Domains', 'Positive');
        await severity('normal');
        await description('Verify user can edit DNS record in hosted zone.');
        await issue(`${QASE_LINK}/01-7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}xaubs66k6r55`, 'ATC_04_06');
        await epic('Domains');

        await step('Click edit Dns Record on type "NS"', async () => {
            dnsRecordsBeforeEdit = (await hostedZonesDetailPage.getDnsRecords()).find((obj) => obj.type === 'NS');
            await hostedZonesDetailPage.clickKebabMenuMenuHostedZone();
            await hostedZonesDetailPage.editButton.click();
        });

        await step('Update fields: name, nameserver, TTL, Comment', async () => {
            expect(await dnsRecordModal.title.textContent()).toEqual('Edit DNS-record');
            dnsObj = await dnsRecordModal.fillForm(dnsRecordsBeforeEdit.type, true);
        });

        await step('Save changes.', async () => {
            await dnsRecordModal.clickSaveButton();
        });

        await step('Verify "Edit DNS-record" modal is not visible.', async () => {
            await expect(hostedZonesDetailPage.hostedZoneModal).not.toBeVisible();
        });

        await step('Verify record was updated in the "DNS Management" card.', async () => {
            const dnsResordsAfterEdit = (await hostedZonesDetailPage.getDnsRecords()).find((obj) => obj.type === 'NS');
            const actualValues = {
                name: dnsResordsAfterEdit.name,
                content: dnsResordsAfterEdit.content,
                ttl: dnsResordsAfterEdit.ttl,
            };

            const expectedValues = {
                name: dnsObj.name,
                content: dnsObj.content,
                ttl: dnsObj.ttl,
            };

            expect(actualValues).toEqual(expectedValues);
        });
    });
});
