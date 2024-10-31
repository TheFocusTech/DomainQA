import { test } from '../fixtures';
import { createHostedZoneAPI, deleteHostedZoneAPI, getHostedZonesAPI } from '../helpers/apiCalls';
import { getCookies, getRandomDomainName } from '../helpers/utils';
import { description, tags, severity, epic, step, tms, issue, feature } from 'allure-js-commons';
import { loginUser } from '../helpers/preconditions';
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
import { expect } from '@playwright/test';

let headers;
let hostedZoneId1;
let domainName1;
let hostedZoneId2;
let domainName2;
let hostedZoneCount;
let hostedZoneId;
let dnsObj;

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

test.describe('Hosted zones', () => {
    test('TC_04_02 | Verify user can create hosted zone', async ({
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
        await description('To verify, that user is able to create hosted zone');
        await issue(`${QASE_LINK}/01-`, 'Hosted Zones');
        await tms(`${GOOGLE_DOC_LINK}`, 'ATC_04_02');
        await epic('Domains');
        await feature('Hosted Zones');

        
        await loginUser(page, headerComponent, loginPage, createHostedZoneModal);

        await headerComponent.clickHostedZonesLink();

        await step('Verify that the user is in the Hosted Zone Page', async () => {
            await hostedZonesPage.hostedZonesHeader.isVisible();
        });

        await hostedZonesPage.clickCreateHostedZoneButton();

        await step('Verify that the Modal Window to create Hosted Zone Page is opening', async () => {
        await expect(createHostedZoneModal.hostedZoneDomainNameInput).toBeVisible();
        });

        await createHostedZoneModal.fillHostedZoneDomainNameInput(HOSTED_ZONE_DOMAIN_NAME);
        
        await createHostedZoneModal.clickCloseXButton();

        await createHostedZoneModal.fillHostedZoneDomainNameInput(HOSTED_ZONE_DOMAIN_NAME);

        await createHostedZoneModal.clickCloseCancelButton();

        await createHostedZoneModal.fillHostedZoneDomainNameInput(HOSTED_ZONE_DOMAIN_NAME);       

        await createHostedZoneModal.clickCreateButton();

        await step('Verify toast notification about successful creation of hosted zone.', async () => {
            await expect(toastComponent.promptHZCreated).toBeVisible();
        });
        await step('Verify the creation of the Hosted Zone', async () => {
            await hostedZonesPage.hostedZonesHeader.isVisible();
            await hostedZonesPage.createdHostedZoneTitle.isVisible();
        });

        await createHostedZoneModal.clickCloseXButton();

        await deleteHostedZoneAPI(request, hostedZoneId1, headers); 
});

test('TC_04_02 | Verify user can delete hosted zone', async ({
    page,
    loginPage,
    headerComponent,
    createHostedZoneModal,
    hostedZonesPage,
    toastComponent,
    deleteHostedZoneModal,
    request
}) => {
    await tags('Domains', 'Hosted Zones');
    await severity('normal');
    await description('To verify, that user is able to delete hosted zone');
    await issue(`${QASE_LINK}/01-`, 'Hosted Zones');
    await tms(`${GOOGLE_DOC_LINK}`, 'ATC_04_02');
    await epic('Domains');
    await feature('Hosted Zones');

    let domainName;

    await loginUser(page, headerComponent, loginPage, createHostedZoneModal);
    await page.waitForURL(process.env.URL);

    await step('Preconditions: Create hosted zones via API.', async () => {
        headers = await getCookies(page);

        const response = await createHostedZoneAPI(request, headers);
        domainName = response.domain;
        console.log(domainName);
    });

    await hostedZonesPage.open();

    await hostedZonesPage.clickBreadcrumbMenuHostedZone();
    await hostedZonesPage.clickDeleteButton();

    const textFormModalWindow = await deleteHostedZoneModal.formModalWindow.textContent();
    MODAL_WINDOW_DELETE_HOSTED_ZONE.forEach(expectedText => {
        expect(textFormModalWindow).toContain(expectedText); 
    });

expect(textFormModalWindow).toContain(domainName);

await deleteHostedZoneModal.clickCancelButton();
await hostedZonesPage.clickBreadcrumbMenuHostedZone();
await hostedZonesPage.clickDeleteButton();

await deleteHostedZoneModal.xCloseButton();
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

test('TC_04_03_02 | Verify user can navigate in hosted zone', async ({
    page,
    loginPage,
    headerComponent,
    createHostedZoneModal,
    hostedZonesPage,
    toastComponent,
    deleteHostedZoneModal,
    request
}) => {
    await tags('Domains', 'Hosted Zones');
    await severity('normal');
    await description('To verify, that user is able to navigate in hosted zone');
    await issue(`${QASE_LINK}/01-`, 'Hosted Zones');
    await tms(`${GOOGLE_DOC_LINK}`, 'ATC_04_02');
    await epic('Domains');
    await feature('Hosted Zones');

    await loginUser(page, headerComponent, loginPage, createHostedZoneModal);
    await page.waitForURL(process.env.URL);

    await step('Preconditions: Create hosted zones via API.', async () => {
        headers = await getCookies(page);

    await createHostedZoneAPI(request, headers);
    });

    await hostedZonesPage.open();
    await deleteHostedZoneAPI(request, hostedZoneId1, headers); 
});
});


