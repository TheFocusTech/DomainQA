import { test } from '../fixtures';
import { expect } from '@playwright/test';
import { description, tag, severity, epic, step, tms, issue, tags } from 'allure-js-commons';
import {
    QASE_LINK,
    GOOGLE_DOC_LINK,
    ACCESSIBLE_PAGE_TITLE,
    URL_ENDPOINT,
    AVAILABLE_DOMAIN,
    OCCUPIED_DOMAIN,
} from '../testData';

const nonAuthUserAccessiblePageActions = {
    Transfer: async ({ headerComponent }) => await headerComponent.clickTransferLink(),
    HomePage: async ({ headerComponent }) => await headerComponent.clickHomeButton(),
    WhoIs: async ({ headerComponent }) => await headerComponent.clickWhoisLink(),
    SSLCertificates: async ({ headerComponent }) => await headerComponent.clickSslSertificateLink(),
    Blog: async ({ headerComponent }) => await headerComponent.clickBlogButton(),
    HelpCenter: async ({ headerComponent }) => await headerComponent.clickHelpCenterButton(),
    ReportAbuse: async ({ footerComponent }) => await footerComponent.clickReportAbuseLink(),
    ContactUs: async ({ footerComponent }) => await footerComponent.clickContactUsLink(),
};

const accessiblePageRedirectCases = Object.keys(ACCESSIBLE_PAGE_TITLE).map((key) => ({
    linkName: key,
    action: nonAuthUserAccessiblePageActions[key],
    expectedTitle: ACCESSIBLE_PAGE_TITLE[key],
}));

test.describe('Unauthorized user', () => {
    test.beforeEach(async ({ page }) => {
        await step('Open web-site as Non authorized user', async () => {
            await page.goto('/');
        });
    });

    accessiblePageRedirectCases.forEach(({ linkName, expectedTitle, action }) => {
        test(`TC_09_01|  Verify that non authorized user can navigate through  ${linkName} page`, async ({
            page,
            headerComponent,
            pageTitleComponent,
            footerComponent,
        }) => {
            await tag('Unauthorized_user');
            await severity('normal');
            await description(`Verify that ${linkName} page is accessible for non authorized user`);
            await issue(`${QASE_LINK}/01-16`, 'Redirect to available pages');
            await tms(`${GOOGLE_DOC_LINK}jcvsnakk56kb`, 'ATC_09_01');
            await epic('Non_authorized_user');

            await action({ headerComponent, footerComponent });
            await step(`Verify user is on ${linkName} page`, async () => {
                await page.waitForURL(process.env.URL + URL_ENDPOINT[linkName]);
                await expect(pageTitleComponent.pageTitle).toContainText(expectedTitle);
            });
        });
    });

    test(`TC_09_02_01|  Verify unauthorized user can search available domains (no filters)`, async ({
        domainAvailabilityPage,
        homePage,
    }) => {
        await tags('Unauthorized_user', 'Domains');
        await severity('normal');
        await description(`Verify that unauthorized user can search available domains (no filters)`);
        await issue(`${QASE_LINK}case=30`, 'Search domain without filter');
        await tms(`${GOOGLE_DOC_LINK}siwvvkxng0dk`, 'ATC_09_02_01');
        await epic('Unauthorized_user');

        await step(
            `Verify that the form “Search domain”, including the placeholder "Search domain", filter and button 'Search domain', is visible`,
            async () => {
                await homePage.domainSearchInput.isVisible();
                await expect(homePage.domainSearchInput).toHaveAttribute('placeholder', 'Search domain');
                await homePage.filterButton.isVisible();
            }
        );

        await homePage.fillDomainSearchInput(AVAILABLE_DOMAIN);
        await homePage.clickSearchButton();

        await step(`Verify that search result contains the domain, price and button "Buy" `, async () => {
            await expect(domainAvailabilityPage.resultSearch).toContainText(AVAILABLE_DOMAIN);

            const elementText = await domainAvailabilityPage.resultSearch.textContent();
            const regex = /\.(com|net|org)/;
            expect(regex.test(elementText)).toBe(true);
            await expect(domainAvailabilityPage.resultSearch).toContainText('Renewal');
            await expect(domainAvailabilityPage.buyButton).toBeVisible();
        });

        await domainAvailabilityPage.clickBuyButton();
    });

    test(`TC_09_02_02|  Verify unauthorized user can search occupied domains (no filters)`, async ({
        domainAvailabilityPage,
        homePage,
    }) => {
        await tags('Unauthorized_user', 'Search_domains');
        await severity('normal');
        await description(`Verify that unauthorized user can search occupied domains (no filters)`);
        await issue(`${QASE_LINK}case=30`, 'Search domain');
        await tms(`${GOOGLE_DOC_LINK}d5owqs6b2e7v`, 'ATC_09_02_02');
        await epic('Unauthorized_user');
        await step(`Verify that the form “Search domain” is visible`, async () => {
            await homePage.domainSearchInput.isVisible();
            await expect(homePage.domainSearchInput).toHaveAttribute('placeholder', 'Search domain');
            await homePage.filterButton.isVisible();
        });

        await homePage.fillDomainSearchInput(OCCUPIED_DOMAIN);
        await homePage.clickSearchButton();

        await step(
            `Verify that search results contain name of the searching domain, text 'This domain is already taken' and text 'Who owns?'`,
            async () => {
                await expect(domainAvailabilityPage.resultSearch).toContainText(OCCUPIED_DOMAIN);
                await expect(domainAvailabilityPage.resultSearch).toContainText('This domain is already taken');
                await expect(domainAvailabilityPage.resultSearch).toContainText('Who owns?');
            }
        );
    });

    test(`TC_09_03_01| Verify unauthorized user can open modal window with filters for advanced search`, async ({
        homePage,
    }) => {
        await tags('Unauthorized_user', 'Search_domains');
        await severity('normal');
        await description(`Verify unauthorized user can open modal window with filters for advanced search`);
        await issue(`${QASE_LINK}case=30`, 'Search domain');
        await tms(`${GOOGLE_DOC_LINK}jgxijwpv69l3`, 'ATC_09_03_01');
        await epic('Unauthorized_user');

        await step(`Verify that the form “Search domain” is visible`, async () => {
            await homePage.domainSearchInput.isVisible();
            await expect(homePage.domainSearchInput).toHaveAttribute('placeholder', 'Search domain');
            await homePage.filterButton.isVisible();
        });

        await homePage.clickFilterButton();

        await step(`Verify "Advanced Search" heading is visible`, async () => {
            await homePage.advancedSearchHeading.isVisible();
        });

        await step(`Verify "Hide Registered" togle is visible`, async () => {
            await homePage.hideRegisteredTogle.isVisible();
        });

        await step(`Verify "Filter by TLD" field is visible`, async () => {
            await homePage.filterByTLDField.isVisible();
        });

        await step(`Verify field “Filter by TLD” has text “Selected (0) TLDs” by default`, async () => {
            await homePage.numberOfSelectedTLDs.isVisible();
        });

        await step(`Verify "Clear all" button is visible`, async () => {
            await homePage.clearAllButton.isVisible();
        });

        await step(`Verify swiper with buttons “All” and ABC is visible`, async () => {
            for (const letter of await homePage.absSwipperButton.all()) {
                await letter.isVisible();
            }
        });

        await step(`Verify "Next Arrow" button in swiper is visible`, async () => {
            await homePage.nextArrow.isVisible();
        });

        await step(`Verify category header “All TLDs” is visible by default`, async () => {
            await homePage.defaultCategory.isVisible();
        });
        await step(`Verify Category list with choiceboxes is visible`, async () => {
            await homePage.categoryList.isVisible();
        });

        await step(`Verify  button “Reset” is visible`, async () => {
            await homePage.resetButton.isVisible();
        });

        await step(`Verify  button “Apply” is visible`, async () => {
            await homePage.applyButton.isVisible();
        });

        await step(`Verify  button “Close” is visible `, async () => {
            await homePage.closeButton.isVisible();
        });
    });
});
