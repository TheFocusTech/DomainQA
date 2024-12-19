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
    ADVANCED_SEARCH_MODAL_TITLE,
    ALL_ABC,
    SUBJECT,
    HEADER_LINKS,
    SSL_CERTIFICATES_SUBSCRIPTIONS,
    RESET_PASSWORD,
    CONTACT_US_DROPDOWN,
    SEARCH_DOMAIN,
    LOGIN_PAGE_HEADER_TEXT,
} from '../testData';
import { signInRequest, changePasswordRequest } from '../helpers/apiCalls';
import { authorize, getVerificationCodeFromEmail } from '../index';
import { delay } from '../helpers/utils';
import { faker } from '@faker-js/faker';
import { ABUSE_REPORT_TYPES, REQUIRED_FIELDS } from '../abuseReportData';

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

    accessiblePageRedirectCases.forEach(({ linkName, expectedTitle, action }, index) => {
        test(`TC_09_01_0${index + 1}|  Verify that non authorized user can navigate through  ${linkName} page`, async ({
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
            await epic('Unauthorized_user');

            await action({ headerComponent, footerComponent });
            await step(`Verify user is on ${linkName} page`, async () => {
                await page.waitForURL(process.env.URL + URL_ENDPOINT[linkName]);
                await expect(pageTitleComponent.pageTitle).toContainText(expectedTitle);
            });
        });
    });

    test('TC_09_02_01|  Verify unauthorized user can search available domains (no filters)', async ({
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

        await step('Verify that search result contains the domain, price and button "Add to cart"', async () => {
            await domainAvailabilityPage.resultSearch.isVisible();
            await expect(domainAvailabilityPage.resultSearch).toContainText(AVAILABLE_DOMAIN);

            const elementText = await domainAvailabilityPage.resultSearch.textContent();
            const regex = /\.(com|net|org)/;
            expect(regex.test(elementText)).toBe(true);
            await expect(domainAvailabilityPage.resultSearch).toContainText('Renewal');
            await expect(domainAvailabilityPage.addToCartButton).toBeVisible();
        });

        await domainAvailabilityPage.clickAddToCartButton();
    });

    test('TC_09_02_02|  Verify unauthorized user can search occupied domains (no filters)', async ({
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
                await domainAvailabilityPage.resultSearch.isVisible();
                await expect(domainAvailabilityPage.resultSearch).toContainText(OCCUPIED_DOMAIN);
                await expect(domainAvailabilityPage.resultSearch).toContainText('This domain is already taken');
                await expect(domainAvailabilityPage.resultSearch).toContainText('Who owns?');
            }
        );
    });

    test('TC_09_05_01 | Verify "Forgot Password" page elements and "Back to Log in" functionality', async ({
        page,
        loginPage,
        headerComponent,
        forgotPasswordPage,
    }) => {
        await tags('Unauthorized_user', 'Forgot password');
        await severity('normal');
        await description('To verify Forgot Password page elements and "Back to Log in" functionality.');
        await issue(`${QASE_LINK}/01-34`, 'Reset password');
        await tms(`${GOOGLE_DOC_LINK}b6bkqpuifgij`, 'ATC_09_05_01');
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

    test('TC_09_05_02 | Verify "Check email" form elements and "Back to Forgot password" functionality', async ({
        page,
        loginPage,
        headerComponent,
        forgotPasswordPage,
    }) => {
        await tags('Unauthorized_user', 'Forgot password');
        await severity('normal');
        await description('To verify Check email form elements and "Back to Forgot password" functionality.');
        await issue(`${QASE_LINK}/01-34`, 'Reset password');
        await tms(`${GOOGLE_DOC_LINK}e2oglh5bachy`, 'ATC_09_05_02');
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

        await step('Verify resend code button with countdown timer is visible', async () => {
            await expect(forgotPasswordPage.resendCodeButton).toBeVisible();
            await expect(await forgotPasswordPage.resendCodeButton.textContent()).toMatch(
                /Resend code \(0[0-1]:[0-5][0-9]\)/
            );
        });

        await step('Verify the "Resend code" button is disabled', async () => {
            await expect(forgotPasswordPage.resendCodeButton).toBeDisabled();
        });

        await step('Verify "Continue" button is visible', async () => {
            await expect(forgotPasswordPage.continueButton).toBeVisible();
        });

        await step('Verify "Back to Password recovery" button is visible', async () => {
            await expect(forgotPasswordPage.backToPasswordRecoveryButton).toBeVisible();
        });

        await forgotPasswordPage.clickBackToPasswordRecovery();

        await step('Verify user is redirected back to the Forgot Password page', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.forgotPassword);
            await expect(forgotPasswordPage.header).toBeVisible();
        });
    });

    // TC_09_03_05 will be executed once availability data for purchase or registration status is received for each category across all TLDs.
    test.skip(`TC_09_03_05 | Verify unauthorized user can select TLD in different categories and see relevant search results`, async ({
        homePage,
        advancedSearchModal,
        domainAvailabilityPage,
    }) => {
        await tags('Unauthorized_user', 'Search_domains');
        await severity('normal');
        await description(
            `Verify unauthorized user can select TLD in different categories and see relevant search results`
        );
        await issue(`${QASE_LINK}/01-17`, 'Search domain with filters');
        await tms(`${GOOGLE_DOC_LINK}5vbs55mgoksg`, 'ATC_09_02_05');
        await epic('Unauthorized_user');
        await homePage.fillDomainSearchInput(AVAILABLE_DOMAIN);
        await homePage.clickFilterButton();
        await step(`Verify that modal window has title ${ADVANCED_SEARCH_MODAL_TITLE}`, async () => {
            expect(await advancedSearchModal.advancedSearchHeader).toHaveText(ADVANCED_SEARCH_MODAL_TITLE);
        });

        const numberOfCategories = 3;
        const numberOfTLDs = 2;
        const selectedTLDs = await advancedSearchModal.selectSeveralCategoriesAndTLDs(numberOfCategories, numberOfTLDs);

        await step(
            `Verify that user can see selected numbers of TLDs in header: Selected (${selectedTLDs.length}) TLDs`,
            async () => {
                await expect(await advancedSearchModal.getQuantitySelectedTLDs()).toEqual(
                    `Selected (${selectedTLDs.length}) TLDs`
                );
            }
        );

        await advancedSearchModal.clickApplyButton();
        await step(`Verify the Filter button has badge indicator`, async () => {
            await expect(await homePage.filterApplyBadge).toBeVisible();
        });

        await homePage.clickSearchButton();
        await expect(await domainAvailabilityPage.resultsSection).toBeVisible();

        await step(`Verify that search result contains selected domains: ${selectedTLDs}`, async () => {
            await expect(await domainAvailabilityPage.resultSearchList).toHaveCount(selectedTLDs.length);
            let resultsList = await domainAvailabilityPage.resultSearchList;
            for (let i = 0; i < resultsList.length; i++) {
                await expect(resultsList[i]).toContainText(AVAILABLE_DOMAIN + `${selectedTLDs[i]}`);
            }
        });
    });

    test.skip(`TC_09_03_06 | Verify that user can select several TLDs and see relevant search results`, async ({
        homePage,
        advancedSearchModal,
        domainAvailabilityPage,
    }) => {
        await tags('Unauthorized_user', 'Search_domains');
        await severity('normal');
        await description(`Verify that user can select several TLDs and see relevant search results`);
        await issue(`${QASE_LINK}/01-17`, 'Search domain with filters');
        await tms(`${GOOGLE_DOC_LINK}cba4s4hsjfkn`, 'ATC_09_03_06');
        await epic('Unauthorized_user');
        test.slow();

        await homePage.fillDomainSearchInput(AVAILABLE_DOMAIN);
        await homePage.clickFilterButton();
        await step(`Verify that modal window has title ${ADVANCED_SEARCH_MODAL_TITLE}`, async () => {
            expect(await advancedSearchModal.advancedSearchHeader).toHaveText(ADVANCED_SEARCH_MODAL_TITLE);
        });

        const category = 'All';
        const numberOfTLDs = 5;
        const selectedTLDs = await advancedSearchModal.selectTLDs(category, numberOfTLDs);
        for (const TLD of selectedTLDs) {
            await step(
                `Verify if user select TLD ${TLD} in "All" categories the "${TLD[1]}" category has badge`,
                async () => {
                    await expect(await advancedSearchModal.categoryTLD(TLD[1])).toHaveClass(
                        /tld-item_tld-item--selected*/
                    );
                }
            );
        }

        await step(
            `Verify that user can see selected numbers of TLDs in header: Selected (${selectedTLDs.length}) TLDs`,
            async () => {
                await expect(await advancedSearchModal.getQuantitySelectedTLDs()).toEqual(
                    `Selected (${selectedTLDs.length}) TLDs`
                );
            }
        );
        await advancedSearchModal.clickApplyButton();
        await step(`Verify the Filter button has badge indicator`, async () => {
            await expect(await homePage.filterApplyBadge).toBeVisible();
        });

        await homePage.clickSearchButton();
        await expect(await domainAvailabilityPage.resultsSection).toBeVisible();

        await step(`Verify that search result contains selected domains: ${selectedTLDs}`, async () => {
            await domainAvailabilityPage.resultSearchList.last().waitFor({ state: 'visible' });
            await expect(await domainAvailabilityPage.resultSearchList).toHaveCount(selectedTLDs.length);
            let resultsList = await domainAvailabilityPage.resultSearchList;
            for (let i = 0; i < resultsList.length; i++) {
                await expect(resultsList[i]).toContainText(AVAILABLE_DOMAIN + `${selectedTLDs[i]}`);
            }
        });
    });

    test(`TC_09_03_02 | Verify that filters button has badge indicator when at least one filter is applied`, async ({
        homePage,
        advancedSearchModal,
    }) => {
        await tags('Unauthorized_user', 'Search_domains');
        await severity('normal');
        await description(`Verify that filters button has badge indicator when at least one filter is applied`);
        await issue(`${QASE_LINK}/01-30`, 'Search domain');
        await tms(`${GOOGLE_DOC_LINK}123ax97f4085`, 'ATC_09_03_02');
        await epic('Unauthorized_user');
        await step(`Verify that the form “Search domain” is visible`, async () => {
            await homePage.domainSearchInput.isVisible();
            await expect(homePage.domainSearchInput).toHaveAttribute('placeholder', 'Search domain');
            await homePage.filterButton.isVisible();
        });

        await homePage.clickFilterButton();
        const tldName = await advancedSearchModal.randomTLD(0).textContent();

        await step('Click on the choicebox “.com” (can be random TLD)', async () => {
            await advancedSearchModal.randomTLD(0).click();
        });

        await step(
            `Verify that ${tldName} button is active (has badge) (the first letter of the selected TLD)`,
            async () => {
                const letter = tldName.slice(1, 2);
                const { backgroundColor } = await advancedSearchModal.getStyleSelectedTLDItem(letter);
                expect(backgroundColor).toBe('rgb(0, 251, 196)');
            }
        );
        await advancedSearchModal.clickApplyButton();

        await step('Verify the filter button has badge indicator', async () => {
            await expect(homePage.filterApplyBadge).toBeVisible();
        });
    });

    test(`TC_09_03_01| Verify unauthorized user can open modal window with filters for advanced search`, async ({
        homePage,
        advancedSearchModal,
    }) => {
        await tags('Unauthorized_user', 'Search_domains');
        await severity('normal');
        await description(`Verify unauthorized user can open modal window with filters for advanced search`);
        await issue(`${QASE_LINK}/01-17`, 'Search domain');
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
            for (const letter of await advancedSearchModal.abcSwipperButton.all()) {
                await expect(letter).toBeVisible();
            }
            expect(await advancedSearchModal.getAbcSwipperButtonTexts()).toEqual(ALL_ABC);
            await expect(advancedSearchModal.abcSwipperButton).toHaveCount(27);
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

    test(`TC_09_03_03 | Verify that activating the 'Hide registered' toggle displays only unregistered domains in the search results, 'Reset' and 'X' buttons`, async ({
        advancedSearchModal,
        homePage,
    }) => {
        await tags('Unauthorized_user', 'Search_domains');
        await severity('normal');
        await description(
            `Verify that activating the 'Hide registered' toggle displays only unregistered domains in the search results, 'Reset' and 'X' buttons`
        );
        await issue(`${QASE_LINK}/01-30`, 'Search domain');
        await tms(`${GOOGLE_DOC_LINK}vzpec8fhdas9`, 'ATC_09_03_03');
        await epic('Unauthorized_user');

        await homePage.domainSearchInput.isVisible();
        await homePage.fillDomainSearchInput('hourse.com');

        await step('Click on the "Search" button', async () => {
            await homePage.searchButton.click();
        });

        let arrButtonNames = await homePage.getListCardButtonsName();

        await step(
            'Verify that both registered and unregistered domains are displayed in the search results',
            async () => {
                expect(arrButtonNames).toContain('Who owns?');
                expect(arrButtonNames).toContain('Add to cart');
            }
        );

        await homePage.clickFilterButton();

        await step('Activate the toggle "Hide registered".', async () => {
            await advancedSearchModal.clickToggleHideRegistered();
            await expect(advancedSearchModal.toggleInput).toHaveAttribute('value', 'true');
        });

        await step('Verify the filter button has badge indicator', async () => {
            await advancedSearchModal.clickApplyButton();
            await expect(advancedSearchModal.toggleControl).not.toBeVisible();
            await expect(homePage.filterApplyBadge).toBeVisible();
        });

        await step('Click on the "Search" button', async () => {
            await homePage.searchButton.click();
        });

        await step(
            'Only unregistered domains that have the "Add to cart" button are displayed in the search results',
            async () => {
                arrButtonNames = await homePage.getListCardButtonsName();
                expect(arrButtonNames).not.toContain('Who owns?');
                expect(arrButtonNames).toContain('Add to cart');
            }
        );

        await homePage.clickFilterButton();

        await step('Click Reset button', async () => {
            await advancedSearchModal.resetButton.click();
        });

        await step('Verify Hide registered toggle is not active', async () => {
            await expect(advancedSearchModal.toggleInput).toHaveAttribute('value', 'false');
        });

        await step('Click "X" button', async () => {
            await advancedSearchModal.closeButton.click();
        });

        await step('Verify the Filter button does NOT have badge indicator', async () => {
            await expect(homePage.filterApplyBadge).not.toBeVisible();
        });
    });

    const links = [HEADER_LINKS[0].links[0].name, HEADER_LINKS[0].links[1].name, HEADER_LINKS[1].links[0].name];
    for (let link of links) {
        test(`TC_09_04_01 | Verify unauthorised user is redirected to the Login Page by clicking on the ${link} link in header`, async ({
            headerComponent,
            loginPage,
        }) => {
            await tags('Unauthorized_user', 'Redirect_to_Login_Page');
            await severity('normal');
            await description(
                `Verify an unauthorized user is redirected to the Login Page by clicking on the ${link} link in header`
            );
            await issue(`${QASE_LINK}/01-18`, 'Redirect to Login Page');
            await tms(`${GOOGLE_DOC_LINK}d35uri5uazho`, 'ATC_09_04_01');
            await epic('Unauthorized_user');

            if (link === HEADER_LINKS[0].links[0].name) {
                await headerComponent.clickRegisteredDomainsButton();
            }
            if (link === HEADER_LINKS[0].links[1].name) {
                await headerComponent.clickHostedZonesLink();
            }
            if (link === HEADER_LINKS[1].links[0].name) {
                await headerComponent.clickHostingButton();
            }

            await step('Verify the Login Page is open', async () => {
                await expect(loginPage.header).toBeVisible();
                await expect(loginPage.description).toBeVisible();
                await expect(loginPage.loginButton).toBeVisible();
            });
        });
    }

    const buttons = [HEADER_LINKS[0].links[2].buttons[1], HEADER_LINKS[0].links[2].buttons[2]];
    for (let button of buttons) {
        test(`TC_09_04_03 | Verify unauthorised user is redirected to the Login Page by clicking on ${button} button on Transfer Page`, async ({
            headerComponent,
            transferPage,
            loginPage,
        }) => {
            await tags('Unauthorized_user', 'Redirect_to_Login_Page');
            await severity('normal');
            await description(
                `Verify an unauthorized user is redirected to the Login Page by clicking on the ${button} button on Transfer Page`
            );
            await issue(`${QASE_LINK}/01-18`, 'Redirect to Login Page');
            await tms(`${GOOGLE_DOC_LINK}q2w803gtufhx`, 'ATC_09_04_03');
            await epic('Unauthorized_user');

            await headerComponent.clickTransferLink();

            if (button === HEADER_LINKS[0].links[2].buttons[1]) {
                await transferPage.clickBulkTransferButton();
            }
            if (button === HEADER_LINKS[0].links[2].buttons[2]) {
                await transferPage.clickMyTransfersButton();
            }

            await step('Verify the Login Page is open', async () => {
                await expect(loginPage.header).toBeVisible();
                await expect(loginPage.description).toBeVisible();
                await expect(loginPage.loginButton).toBeVisible();
            });
        });
    }

    const sslCertificatesSubscription = Object.values(SSL_CERTIFICATES_SUBSCRIPTIONS);
    sslCertificatesSubscription.forEach((subscription) => {
        test(`TC_09_04_02 | Verify unauthorised user is redirected to the Login Page from the ${subscription} subscription SSL Сertificates`, async ({
            headerComponent,
            sslCertificatesPage,
            loginPage,
        }) => {
            await tags('Unauthorized user', 'Redirect to Login Page');
            await severity('normal');
            await description(
                `Verify that an unauthorized user is redirected to the Login Page from the Certificates Page after clicking the Select button of the ${subscription} subscription SSL Сertificates`
            );
            await issue(`${QASE_LINK}/01-18`, 'Unauthorized user');
            await tms(`${GOOGLE_DOC_LINK}63m6yfip96dy`, 'ATC_09_04_02');
            await epic('Unauthorized_user');

            await headerComponent.clickButton(HEADER_LINKS[1].trigger);
            await headerComponent.clickLink(HEADER_LINKS[1].links[1].name);
            await sslCertificatesPage.clickSelectButton(subscription);

            await step('Verify the Login Page is open', async () => {
                await expect(loginPage.header).toBeVisible();
                await expect(loginPage.description).toBeVisible();
                await expect(loginPage.loginButton).toBeVisible();
            });
        });
    });

    const abc = ALL_ABC.slice(1);

    for (let letter of abc) {
        test(`TC_09_03_04 | Verify switch to "${letter}" categories  and select/clear all TLDs , if this the list of the category is not empty`, async ({
            homePage,
            advancedSearchModal,
        }) => {
            await tags('Unauthorized_user', 'Search_domains');
            await severity('normal');
            await description(
                `Verify that user can switch between categories, select all TLDs in the category and clear all TLDs`
            );
            await issue(`${QASE_LINK}/01-17`, 'Search domain');
            await tms(`${GOOGLE_DOC_LINK}lg4vntkzbngo`, 'ATC_09_03_04');
            await epic('Unauthorized_user');

            await step(`Verify that the form “Search domain” is visible`, async () => {
                await expect(homePage.domainSearchInput).toBeVisible();
                await expect(homePage.domainSearchInput).toHaveAttribute('placeholder', 'Search domain');
                await expect(homePage.filterButton).toBeVisible();
            });

            await homePage.clickFilterButton();

            await advancedSearchModal.category.first().waitFor({ timeout: 10000 });
            const allCategorysList = await advancedSearchModal.getCategorysList();
            const filteredCategorysList = allCategorysList.filter((el) => el.substring(0, 2) == `.${letter}`);

            await advancedSearchModal.clickLetterButton(letter);

            if (filteredCategorysList.length == 0) {
                await step(`Verify there is no any category, starting from "${letter}"`, async () => {
                    await expect(advancedSearchModal.categoryArea).not.toBeAttached();
                });
            } else {
                await step(`Verify that all chosen boxes have TLD, starting from "${letter}"`, async () => {
                    await advancedSearchModal.category.first().waitFor({ timeout: 10000 });
                    const categorysList = await advancedSearchModal.getCategorysList();
                    expect(categorysList).toEqual(filteredCategorysList);
                });

                await advancedSearchModal.clickSelectAllCategoryButton();

                await step(`Verify that "${letter}" button is active (has badge)`, async () => {
                    await expect(advancedSearchModal.letterButton(letter)).toHaveClass(/tld-item--selected/);
                });

                await step(`Verify that all choiceboxes are selected `, async () => {
                    for (const el of await advancedSearchModal.categoryArea.all()) {
                        await expect(el).toBeChecked();
                    }
                });

                await step(`Verify that Filter by TLD displaies the number of selected TLD `, async () => {
                    const categorysList = await advancedSearchModal.getCategorysList();
                    const selectedTLDNumber = categorysList.length;
                    await expect(advancedSearchModal.filterHeader).toHaveText(
                        'Selected (' + selectedTLDNumber + ') TLDs'
                    );
                    console.log(selectedTLDNumber);
                });

                await advancedSearchModal.clickСlearAllButton();

                await step(`Verify that "${letter}" button is unactive (has not badge)`, async () => {
                    await expect(advancedSearchModal.letterButton(letter)).not.toHaveClass(/tld-item--selected/);
                });

                await step(`Verify that all choiceboxes are not selected `, async () => {
                    for (const el of await advancedSearchModal.categoryArea.all()) {
                        await expect(el).not.toBeChecked();
                    }
                });

                await step(`Verify that Filter by TLD displaies 0 `, async () => {
                    await expect(advancedSearchModal.filterHeader).toHaveText('Selected (0) TLDs');
                });
            }
        });
    }
});
test.describe('Reset Password', () => {
    test('TC_09_05_03 | Verify password recovery process', async ({
        page,
        request,
        loginPage,
        headerComponent,
        forgotPasswordPage,
    }) => {
        test.setTimeout(60000);
        await tags('Unauthorized_user', 'Forgot password');
        await severity('normal');
        await description('To verify that user can reset the password.');
        await issue(`${QASE_LINK}/01-34`, 'Reset password');
        await tms(`${GOOGLE_DOC_LINK}9prb2gacbixm`, 'ATC_09_05_03');
        await epic('Unauthorized_user');

        const email = RESET_PASSWORD.email;
        const defaultPassword = RESET_PASSWORD.defaultPassword;
        const newPassword = RESET_PASSWORD.newPassword;
        const codePattern = RESET_PASSWORD.codePattern;

        await step(
            'Preconditions: Attempt to sign in with the new password, and once signed in, change it back to the default.',
            async () => {
                const response = await signInRequest(request, email, newPassword);

                if (response.ok()) {
                    await changePasswordRequest(request, newPassword, defaultPassword);
                }
            }
        );

        await step('Navigate to Home page.', async () => {
            await page.goto('/');
        });

        await headerComponent.clickLogin();
        await page.waitForURL(process.env.URL + URL_ENDPOINT.login);

        await loginPage.clickForgotPassword();
        await page.waitForURL(process.env.URL + URL_ENDPOINT.forgotPassword);

        await forgotPasswordPage.fillEmailInput(email);
        await forgotPasswordPage.clickSendCode();
        await delay(20000);

        const verificationCode = await getVerificationCodeFromEmail(await authorize(), email, SUBJECT.resetPassword);

        await step('Verify an email with a verification code is sent', () => {
            expect(verificationCode).not.toBeNull();
            expect(verificationCode).toMatch(codePattern);
        });

        await forgotPasswordPage.fillCodeField(verificationCode);
        await forgotPasswordPage.clickContinue();

        await step('Verify "Create password" form is displayed', async () => {
            await expect(forgotPasswordPage.headerCreatePassword).toBeVisible();
        });

        await forgotPasswordPage.fillPasswordInput(newPassword);
        await forgotPasswordPage.fillRepeatPasswordInput(newPassword);
        await forgotPasswordPage.clickContinue();

        await step('Verify user is redirected to the Login page', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.login);
            await expect(page).toHaveURL(process.env.URL + URL_ENDPOINT.login);
        });

        await step('Verify user can log in with the new password', async () => {
            await loginPage.fillEmailAddressInput(email);
            await loginPage.fillPasswordInput(newPassword);
            await loginPage.clickLogin();
            await page.waitForURL(process.env.URL);
            await expect(headerComponent.myProfileButton).toBeVisible();
        });
    });
});

test.describe('Contact Us', async () => {
    CONTACT_US_DROPDOWN.forEach((item, index) => {
        test(`TC_09_06_${String(index + 1).padStart(2, '0')} | Verify unauthorized users can submit the "Contact Us" form for "${item.name}" Type`, async ({
            page,
            footerComponent,
            helpContactusPage,
        }) => {
            await tags('Unauthorized_user', 'Contact_us_form');
            await severity('normal');
            await description(`Verify unauthorized users can submit the "Contact Us" form`);
            await issue(`${QASE_LINK}/01-19`, 'Contact Us form');
            await tms(`${GOOGLE_DOC_LINK}u35mzacv094r`, 'ATC_09_06');
            await epic('Unauthorized_user');

            await step('Navigate to Home page.', async () => {
                await page.goto('/');
            });

            const email = faker.internet.email().toLowerCase();
            await footerComponent.clickContactUsLink();
            await step('Wait for full loading page', async () => {
                await page.waitForURL(process.env.URL + URL_ENDPOINT.ContactUs);
                await page.waitForLoadState('networkidle');
            });
            await helpContactusPage.fillEmailInput(email);
            await helpContactusPage.clickTypeDropdown();
            await helpContactusPage.chooseTypeOption(item.name);
            if (item.subcategories.length > 0) {
                await helpContactusPage.clickRequestTypeDropdown();
                const randomSubcategory = Math.floor(Math.random() * item.subcategories.length);
                await helpContactusPage.chooseTypeOption(item.subcategories[randomSubcategory]);
            }
            await helpContactusPage.fillSubjectInput('AUTOTST');
            await helpContactusPage.fillDescriptionInput(faker.lorem.lines(2));
            await helpContactusPage.clickSubmitButton();
            await step('Verify header has "Thank you!" text ', async () => {
                await helpContactusPage.heading.waitFor({ state: 'visible' });
                expect(await helpContactusPage.heading).toHaveText('Thank you!');
            });
            await step('Verify text after successful submit.', async () => {
                expect(await helpContactusPage.successMessage).toHaveText(
                    `Your report has been successfully submitted. We will send you a reply to ${email}`
                );
            });
            await step('Verify "Return Home" and "Go To Trustname" buttons are visible after submit', async () => {
                expect(await helpContactusPage.returnHomeButton).toBeVisible();
                expect(await helpContactusPage.goToTrustnameButton).toBeVisible();
            });
            await step(
                'Verify that randomly click on "Return Home" or "Go To Trustname" button redirect to correct page',
                async () => {
                    let randomNumber = Math.floor(Math.random() * 2);
                    await helpContactusPage.randomlyClickButton(randomNumber);
                    if (randomNumber === 0) {
                        await expect(page).toHaveURL(process.env.URL + URL_ENDPOINT.HelpCenter);
                    } else {
                        await expect(page).toHaveURL(process.env.URL);
                    }
                }
            );
        });
    });
});

test.describe('Unauthorised user Domain availability Page', () => {
    test(`TC_09_04_04|  Verify unauthorised user must redirect to the login page from Domain availability Page`, async ({
        page,
        domainAvailabilityPage,
        homePage,
        pageTitleComponent,
        loginPage,
    }) => {
        await tags('Unauthorized_user', 'Domains');
        await severity('normal');
        await description(`Verify unauthorised user must redirect to the login page from Domain availability Page`);
        await issue(`${QASE_LINK}/01-30`, 'Search domain');
        await tms(`${GOOGLE_DOC_LINK}grun8oizo8vy`, 'ATC_09_04_04');
        await epic('Unauthorized_user');

        await page.goto('/');
        await homePage.fillDomainSearchInput(SEARCH_DOMAIN);
        await homePage.clickSearchButton();
        await domainAvailabilityPage.clickAddToCartButton();

        await step(`Verify Login Page Element Validation `, async () => {
            await expect(pageTitleComponent.pageTitle).toHaveText(LOGIN_PAGE_HEADER_TEXT);
            await expect(loginPage.loginButton).toBeVisible();
        });
    });
});

test.describe('Report Abuse submission for each type of report', () => {
    test.beforeEach(async ({ page, footerComponent, reportAbusePage }) => {
        await step('Open Home page as Non authorized user', async () => {
            await page.goto('/');
        });
        await step('Click on "Report Abuse" link in Footer', async () => {
            await footerComponent.clickReportAbuseLink();
        });
        await step('Click on  "Abuse type" dropdown', async () => {
            await reportAbusePage.clickAbuseTypeDropdown();
        });
    });

    ABUSE_REPORT_TYPES.forEach((abuseType, index) => {
        test(`TC_09_07_0${index + 1}| Verify unauthorized user can submit the "Report Abuse" form for ${abuseType}`, async ({
            reportAbusePage,
            statusReportAbusePage,
        }) => {
            await tags('Unauthorized_user');
            await severity('normal');
            await description(
                'Verify unauthorized user can submit the "Report Abuse" form for each Abuse type by filling in required fields'
            );
            await issue(`${QASE_LINK}/01-20`, 'Submit Report Abuse form;');
            await tms(`${GOOGLE_DOC_LINK}u4qa48p3hb3p`, 'ATC_09_07');
            await epic('Unauthorized_user');

            await step('Select Abuse type from dropdown', async () => {
                await reportAbusePage.selectAbuseType(abuseType);
            });
            await step('Fill in required fields', async () => {
                await reportAbusePage.fillRequiredFields();
            });
            await step('Accept all requiredcheckboxes', async () => {
                await reportAbusePage.acceptAllCheckboxes();
            });

            await step('Submit the form', async () => {
                await reportAbusePage.submitForm();
            });
            await step('Verify thanks message is visible and contains corresponding email ', async () => {
                const yourEmail = REQUIRED_FIELDS['Your Email'];
                await statusReportAbusePage.verifySuccessfulSubmission(yourEmail);
            });
        });
    });
});
