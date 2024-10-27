import { test } from '../fixtures';
import { expect } from '@playwright/test';
import { description, tags, severity, epic, step, tms, issue, feature } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, ERROR_DOMAIN } from '../testData';
import { loginUser } from '../helpers/preconditions';

test.describe('Domains', () => {
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
