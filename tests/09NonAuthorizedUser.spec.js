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

    test.skip(`TC_09_02_01|  Verify unauthorized user can search available domains (no filters)`, async ({
        domainAvailabilityPage,
        homePage,
    }) => {
        await tags('Unauthorized_user', 'Domains');
        await severity('normal');
        await description(`Verify that unauthorized user can search available domains (no filters)`);
        await issue(`${QASE_LINK}/01-30`, 'Search domain without filter');
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
        await issue(`${QASE_LINK}/01-30`, 'Search domain');
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

    test('TC_09_05_01 | Verify "Forgot Password" page elements and "Back to Log in" functionality.', async ({
        page,
        loginPage,
        headerComponent,
        forgotPasswordPage,
    }) => {
        await tags('Unauthorized_user', 'Forgot password');
        await severity('normal');
        await description('To verify Forgot Password page elements and "Back to Log in" functionality.');
        await issue(`${QASE_LINK}/01-34`, 'Reset password');
        await tms(`${GOOGLE_DOC_LINK}mnbc66oz78zb`, 'ATC_09_05_01');
        await epic('Unauthorized_user');

        await headerComponent.clickLogin();

        await step('Verify user is on the Login page', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.login);
        });

        await loginPage.clickForgotPassword();

        await step('Verify user is on the Forgot Password page', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.forgotPassword);
            await expect(forgotPasswordPage.header).toBeVisible();
        });

        await step('Verify the description of the page', async () => {
            await expect(forgotPasswordPage.description).toBeVisible();
            await expect(forgotPasswordPage.description).toHaveText(
                'Enter the email address you used to log in and we’ll send you a password reset code.'
            );
        });

        await step('Verify the Email input field is visible', async () => {
            await expect(forgotPasswordPage.emailInput).toBeVisible();
            await expect(forgotPasswordPage.emailInput).toBeEmpty();
        });

        await step('Verify the presence of buttons', async () => {
            await expect(forgotPasswordPage.sendCodeButton).toBeVisible();
            await expect(forgotPasswordPage.backToLoginButton).toBeVisible();
        });

        await forgotPasswordPage.clickBackToLogin();

        await step('Verify user is redirected back to the Login page', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.login);
            await expect(loginPage.forgotPasswordLink).toBeVisible();
        });
    });

    test('TC_09_05_02 | Verify "Check email" form elements and "Back to Forgot password" functionality.', async ({
        page,
        loginPage,
        headerComponent,
        forgotPasswordPage,
    }) => {
        await tags('Unauthorized_user', 'Forgot password');
        await severity('normal');
        await description('To verify Check email form elements and "Back to Forgot password" functionality.');
        await issue(`${QASE_LINK}/01-34`, 'Reset password');
        await tms(`${GOOGLE_DOC_LINK}mnbc66oz78zb`, 'ATC_09_05_02');
        await epic('Unauthorized_user');

        await headerComponent.clickLogin();
        await page.waitForURL(process.env.URL + URL_ENDPOINT.login);

        await loginPage.clickForgotPassword();
        await page.waitForURL(process.env.URL + URL_ENDPOINT.forgotPassword);

        await forgotPasswordPage.fillEmailInput(process.env.USER_EMAIL);

        await forgotPasswordPage.clickSendCode();

        await step('Verify "Check your email" form is visible', async () => {
            await expect(forgotPasswordPage.headerCheckEmail).toBeVisible();
        });

        await step('Verify the form description', async () => {
            await expect(forgotPasswordPage.descriptionCheckEmail).toBeVisible();
            await expect(forgotPasswordPage.descriptionCheckEmail).toHaveText(
                `Enter password reset code we sent to${process.env.USER_EMAIL}`
            );
        });

        await step('Verify the Password reset code input field is visible', async () => {
            await expect(forgotPasswordPage.codeInput).toBeVisible();
            await expect(forgotPasswordPage.codeInput).toBeEmpty();
        });

        await step('Verify the presence of buttons', async () => {
            await expect(forgotPasswordPage.continueButton).toBeVisible();
            await expect(forgotPasswordPage.resendCodeButton).toBeVisible();
            await expect(forgotPasswordPage.backToPasswordRecoveryButton).toBeVisible();
            await expect(forgotPasswordPage.closeButton).toBeVisible();
        });

        await forgotPasswordPage.clickBackToPasswordRecovery();

        await step('Verify user is redirected back to the Forgot Password page', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.forgotPassword);
            await expect(forgotPasswordPage.header).toBeVisible();
        });
    });

    /* 
    Тест будет работать, когда в каждой категории по всем TLD будут приходить данные о доступности для покупки или занятости.
    test(`TC_09_03_05 | Verify unauthorized user can select TLD in different categories and see relevant search results`, async ({
        homePage,
        advancedSearchModal,
        domainAvailabilityPage,
    }) => {
        await tags('Unauthorized_user', 'Search_domains');
        await severity('normal');
        await description(
            `Verify unauthorized user can select TLD in different categories and see relevant search results`
        );
        await issue(`${QASE_LINK}case=17`, 'Search domain with filters');
        await tms(`${GOOGLE_DOC_LINK}5vbs55mgoksg`, 'ATC_09_02_05');
        await epic('Unauthorized_user');
        await homePage.fillDomainSearchInput(AVAILABLE_DOMAIN);
        await homePage.clickFilterButton();
        await advancedSearchModal.modalWindow.waitFor({ status: 'visible' });

        const quantityOfCategories = 3;
        const quantityOfTLDs = 2;
        const selectedTLDs = await advancedSearchModal.selectSeveralCategoriesAndTLDs(
            quantityOfCategories,
            quantityOfTLDs
        );

        await step(
            `Verify that user can see selected numbers of TLDs in header: Selected (${selectedTLDs.length}) TLDs`,
            async () => {
                await expect(await advancedSearchModal.getQuantitySelectedTLDs()).toEqual(
                    `Selected (${selectedTLDs.length}) TLDs`
                );
            }
        );

        await advancedSearchModal.clickApplyButton();
        await expect(await homePage.filterApplyBadge).toBeVisible();

        await homePage.clickSearchButton();
        await expect(await domainAvailabilityPage.resultSearchList).toBeVisible();

        await step(`Verify that search result contains selected domains: ${selectedTLDs}`, async () => {
            await expect(await domainAvailabilityPage.resultSearchList).toHaveCount(selectedTLDs.length);
            let resultsList = await domainAvailabilityPage.resultSearchList;
            for (let i = 0; i < resultsList.length; i++) {
                await expect(resultsList[i]).toContainText(AVAILABLE_DOMAIN + `${selectedTLDs[i]}`);
            }
        });
    });
    */

    test(`TC_09_03_01| Verify unauthorized user can open modal window with filters for advanced search`, async ({
        homePage,
        advancedSearchModal,
    }) => {
        await tags('Unauthorized_user', 'Search_domains');
        await severity('normal');
        await description(`Verify unauthorized user can open modal window with filters for advanced search`);
        await issue(`${QASE_LINK}case=30`, 'Search domain');
        await tms(`${GOOGLE_DOC_LINK}jgxijwpv69l3`, 'ATC_09_03_01');
        await epic('Unauthorized_user');

        await step(`Verify that the form “Search domain” is visible`, async () => {
            await expect(homePage.domainSearchInput).toBeVisible();
            await expect(homePage.domainSearchInput).toHaveAttribute('placeholder', 'Search domain');
            await expect(homePage.filterButton).toBeVisible();
        });

        await homePage.clickFilterButton();

        await step(`Verify "Advanced Search" heading is visible`, async () => {
            await expect(advancedSearchModal.advancedSearchHeading).toBeVisible();
        });

        await step(`Verify "Hide Registered" togle is visible`, async () => {
            await expect(advancedSearchModal.hideRegisteredTogle).toBeVisible();
        });

        await step(`Verify "Filter by TLD" field is visible`, async () => {
            await expect(advancedSearchModal.filterByTLDField).toBeVisible();
        });

        await step(`Verify field “Filter by TLD” has text “Selected (0) TLDs” by default`, async () => {
            await expect(advancedSearchModal.filterHeader).toHaveText('Selected (0) TLDs');
        });

        await step(`Verify "Clear all" button is visible`, async () => {
            await expect(advancedSearchModal.clearAllButton).toBeVisible();
        });

        await step(`Verify swiper with buttons “All” and ABC is visible`, async () => {
            for (const letter of await advancedSearchModal.absSwipperButton.all()) {
                await expect(letter).toBeVisible();
            }
        });

        await step(`Verify "Next Arrow" button in swiper is visible`, async () => {
            await expect(advancedSearchModal.nextArrow).toBeVisible();
        });

        await step(`Verify category header “All TLDs” is visible by default`, async () => {
            await expect(advancedSearchModal.defaultCategory).toBeVisible();
        });
        await step(`Verify Category list with choiceboxes is visible`, async () => {
            await expect(advancedSearchModal.categoryList).toBeVisible();
        });

        await step(`Verify  button “Reset” is visible`, async () => {
            await expect(advancedSearchModal.resetButton).toBeVisible();
        });

        await step(`Verify  button “Apply” is visible`, async () => {
            await expect(advancedSearchModal.applyButton).toBeVisible();
        });

        await step(`Verify  button “Close” is visible `, async () => {
            await expect(advancedSearchModal.closeButton).toBeVisible();
        });
    });
});
