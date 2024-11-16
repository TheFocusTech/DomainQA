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

        const quantityOfCategories = 1;
        const quantityOfTLDs = 1;
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
});

//     test(`TC_09_03_05 | Verify unauthorized user can select TLD in different categories and see relevant search results`, async ({
//         homePage,
//         advancedSearchModal,
//         domainAvailabilityPage,
//     }) => {
//         await tags('Unauthorized user', 'Search domains');
//         await severity('normal');
//         await description(
//             `Verify unauthorized user can select TLD in different categories and see relevant search results`
//         );
//         await issue(`${QASE_LINK}case=17`, 'Search domain with filters');
//         await tms(`${GOOGLE_DOC_LINK}5vbs55mgoksg`, 'ATC_09_03_05');
//         await epic('Unauthorized user');

//         await homePage.fillDomainSearchInput(AVAILABLE_DOMAIN);
//         await homePage.clickFilterButton();
//         // await advancedSearchModal.advancedSearchHeader.waitFor({ status: 'visible' });

//         const quantityOfCategories = 2;
//         const quantityOfTLDsInCategory = 3;
//         const selectedTLDs = await advancedSearchModal.selectSeveralCategoriesAndTLDs(
//             quantityOfCategories,
//             quantityOfTLDsInCategory
//         );

//         await step(
//             `Verify that user can see selected numbers of TLDs in header: Selected (${selectedTLDs.length}) TLDs`,
//             async () => {
//                 await expect(await advancedSearchModal.getQuantitySelectedTLDs()).toEqual(
//                     `Selected (${selectedTLDs.length}) TLDs`
//                 );
//             }
//         );

//         await advancedSearchModal.clickApplyButton();
//         await expect(await homePage.filterApplyBadge).toBeVisible();

//         await homePage.clickSearchButton();
//         // test.setTimeout(15000)
//         // await expect(await domainAvailabilityPage.resultSearchSection).toBeVisible();

//         await step(`Verify that the selected domains are in the list of results`, async () => {
//             //await expect(await domainAvailabilityPage.resultSearchList).toHaveCount(selectedTLDs.length);
//             let arr1 = []
//             let resultsList = await domainAvailabilityPage.resultSearchList.all()
//             for (let i = 0; i < resultsList.length; i++) {
//                  arr1.push(resultsList.innerText()[i]);
//             }
//             let arr = selectedTLDs.map(el => AVAILABLE_DOMAIN + el)
//             console.log(resultsList);
//             console.log(arr1)

//             for (let i = 0; i < resultsList.length; i++) {
//                 let res = arr.includes(resultsList[i])
//                 console.log(resultsList[i], res);

//                 await expect(res).toBeTruthy();
//             }
//         });
//     });
// });
