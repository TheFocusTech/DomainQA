import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { loginUser, createHostedZone, deleteHostedZone } from '../helpers/preconditions';
import { QASE_LINK, GOOGLE_DOC_LINK, HOSTED_ZONE_DOMAIN_NAME, ERROR_DOMAIN } from '../testData';
import { expect } from '@playwright/test';


test.describe('DNS Records', () => {
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
});

    test.describe('Search domains', () => {

    test('TC_04_09_01 | Verify user can search the registered domain', async ({
        page,
        homePage,
        loginPage,
        domainAvailabilityPage,
        whoisSearchResultPage,
    }) => {
        await tags('Domains', 'WhoIs');
        await severity('normal');
        await description('To verify, that user is able to search the registered domain in WhoIs');
        await issue(`${QASE_LINK}`, '');
        await tms(`${GOOGLE_DOC_LINK}`, 'ATC_04_09_01');
        await epic('Domains');
        await feature('Search registered domain');

        await step('Preconditions:', async () => {
            await loginUser(page, homePage, loginPage);
        });

        await step('Verify .', async () => {
            await homePage.domainSearchInput.isVisible();
            await expect(homePage.domainSearchInput).toHaveAttribute('placeholder', 'Search domain');
            await homePage.fillDomainSearchInput('purrweb.com');
            await homePage.clickSearchButton();
            //     await homePage.domainTakenText.isVisible();
            await domainAvailabilityPage.clickWhoOwnsButton();
            await whoisSearchResultPage.resultTitle.isVisible();
            await whoisSearchResultPage.clickfullInfoButton();
        });
    });

    test('TC_04_09_02 | Verify user can search the non-registered domain in Whois page', async ({
        page,
        homePage,
        loginPage,

        whoisSearchResultPage,
        headerComponent,
        whoisPage,
    }) => {
        await tags('Domains', 'WhoIs');
        await severity('normal');
        await description('To verify, that user is able to search the non-registered domain in WhoIs');
        await issue(`${QASE_LINK}`, '');
        await tms(`${GOOGLE_DOC_LINK}`, 'ATC_04_09_01');
        await epic('Domains');
        await feature('Search registered domain');

        await step('Preconditions:', async () => {
            await loginUser(page, homePage, loginPage);
        });

        await step('Verify .', async () => {
            await headerComponent.clickDomainsButton();
            await headerComponent.clickWhoisButton();
            await whoisPage.fillWhoisSearchInput(ERROR_DOMAIN);
            await whoisPage.clickWhoisSearchButton();
            //      await expect(whoisSearchResultPage.resultSearch).toHaveText('No match for "FGGFFGDGDFGD.COM"')
            await whoisSearchResultPage.noMatchText.isVisible();
        });
    });
});


