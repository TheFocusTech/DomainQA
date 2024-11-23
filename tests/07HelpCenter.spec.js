import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import {
    QASE_LINK,
    GOOGLE_DOC_LINK,
    URL_ENDPOINT,
    HELP_SEARCH_POPUP_ALERT,
    INPUT_SEARCH_PART,
    NAME_SEARCH,
    HELP_PAGE_CATEGORY,
    HELP_CATEGORY_SEARCH,
} from '../testData';
import { loginUser } from '../helpers/preconditions';
import { getCategoriesHelpSearchAPI, getResponseHelpSearchAPI } from '../helpers/apiCalls';
import {
    resultAllCategoriesSearch,
    resultNameCategoriesSearch,
    resultCountCategoriesSearch,
    resultPageContainQuerySearch,
} from '../helpers/utils';

test.describe('Help Center', () => {
    //test.use({ viewport: { width: 1600, height: 1200 } });
    //// test.describe.configure({ retries: 2, timeout: 60000 });

    test('TC_07_01_01 | Verify the user can search articles in the Help Center with random characters', async ({
        page,
        headerComponent,
        loginPage,
        helpCenterPage,
    }) => {
        await tags('Help_Center', 'Negative');
        await severity('normal');
        await description(
            'To verify the user gets alert-message when searches in the Help Center with random characters.'
        );
        await issue(`${QASE_LINK}/01-32`, 'User Login');
        await tms(`${GOOGLE_DOC_LINK}zg8gtwoz9y8t`, 'ATC_07_01_01');
        await epic('HelpCenter');
        test.slow();

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await step('Verify the user is redirected to help center page.', async () => {
            await headerComponent.clickHelpCenterButton();
            await expect(page).toHaveURL(URL_ENDPOINT.HelpCenter);
        });

        //const randomString = await helpCenterPage.fillSearchInput();

        await step('Verify the user gets popup alert-message and empty list after input.', async () => {
            await helpCenterPage.fillSearchInput();
            await expect(helpCenterPage.helpSearchPopup).toBeVisible();
            await expect(helpCenterPage.helpSearchPopupAlert).toHaveText(HELP_SEARCH_POPUP_ALERT);
        });

        //await step('Verify the user redirects to search page and gets alert-message.', async () => {
        //    await helpCenterPage.clickHelpCenterSearchButton();
        // const expectedSearchURL = `${process.env.URL}${URL_ENDPOINT.HelpCenterSearch}?search=${randomString}`;
        // await expect(page).toHaveURL(expectedSearchURL);
        //   const alertText = await helpCenterPage.helpSearchPopupAlert.innerText();
        //   const alertNormalizedText = alertText.replace(/“|”/g, '"');
        //  expect(alertNormalizedText).toContain(`No results for "${randomString}"`);
        //});
    });

    test('TC_07_01_03 | Verify  the autocomplete suggestions displayed correspond to the entered letters in Help Center', async ({
        page,
        loginPage,
        headerComponent,
        helpCenterPage,
    }) => {
        await tags('Help center', 'Positive');
        await severity('normal');
        await description(
            'Verify that user can see autocomplete suggestions correspond to the entered letters in Help Center'
        );
        await issue(`${QASE_LINK}/01-32`, 'Help center');
        await tms(`${GOOGLE_DOC_LINK}t0sf9gst04b3`, 'ATC_07_01_03');
        await epic('Help center');
        test.slow();

        await loginUser(page, headerComponent, loginPage);

        await headerComponent.clickHelpCenterButton();
        await page.waitForURL(URL_ENDPOINT.HelpCenter);

        await step(
            'Verify that  autocomplete suggestions that match the input are displayed in popup search window',
            async () => {
                await helpCenterPage.fillHelpSearchInput(INPUT_SEARCH_PART);
                await helpCenterPage.waitForPopupToBeVisible();
                await expect(helpCenterPage.helpSearchPopup).toContainText(new RegExp(INPUT_SEARCH_PART, 'i'));
            }
        );
    });

    test('TC_07_01_05 | Verify the user can switch between categories', async ({
        page,
        loginPage,
        headerComponent,
        helpCenterPage,
        helpSearchResultsPage,
        request,
    }) => {
        await tags('Help center', 'Positive');
        await severity('normal');
        await description('Verify the user can switch between categories and hide categories.');
        await issue(`${QASE_LINK}/01-32`, 'Help center');
        await tms(`${GOOGLE_DOC_LINK}xqp3coi93i74`, 'ATC_07_01_05');
        await epic('Help center');

        test.slow();
        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);
        await headerComponent.clickHelpCenterButton();
        await helpCenterPage.fillHelpSearchInput(`${NAME_SEARCH}`);
        // await helpCenterPage.clickHelpCenterSearchButton();
        await step('Go to the result search page.', async () => {
            await page.goto(`${process.env.URL}/help/search?search=${NAME_SEARCH}`);
        });
        await step('Verify search for the input query is visible on the search results page.', async () => {
            await expect(helpSearchResultsPage.headerText).toContainText(`${NAME_SEARCH}`);
        });

        await helpSearchResultsPage.allCategoriesButton.waitFor({ state: 'visible' });

        const categName = await getCategoriesHelpSearchAPI(request, 'name');
        const categId = await getCategoriesHelpSearchAPI(request, 'id');

        await step(
            'Verify category "All Categories" contains only names categories from the list of categories in the articles.',
            async () => {
                const allCategories = await getResponseHelpSearchAPI(request, '', 'category_name');
                await expect((await resultAllCategoriesSearch(categName, allCategories)).toString()).toEqual('true');
            }
        );

        await step('Verify other categories contain only the names of their categories in the articles.', async () => {
            await expect((await resultNameCategoriesSearch(categId, categName, request)).toString()).toEqual('true');
        });

        await step('Verify the count for each category is visible in the title.', async () => {
            await expect((await resultCountCategoriesSearch(page, helpSearchResultsPage)).toString()).toEqual('true');
        });

        await step('Verify Dropdown “By Category” is hidden.', async () => {
            await helpSearchResultsPage.clickAccordionByCategoryLabel();
            await expect(helpSearchResultsPage.accordionByCategoryButton).not.toHaveClass(
                'accordion-slice_accordion-slice-header__trigger--active__xgc2K'
            );
        });
    });

    test('TC_07_01_04 | Verify Search articles with Valid Query', async ({
        page,
        loginPage,
        headerComponent,
        request,
    }) => {
        await tags('Help center', 'Positive');
        await severity('normal');
        await description('Verify that relevant articles are displayed.');
        await issue(`${QASE_LINK}/01-32`, 'Help center');
        await tms(`${GOOGLE_DOC_LINK}xvx5scpwj3i2`, 'ATC_07_01_04');
        await epic('Help center');

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await step(`Verify all articles contain a search query ${NAME_SEARCH}.`, async () => {
            await expect((await resultPageContainQuerySearch(request)).toString()).toEqual('true');
        });
    });

    test('TC_07_02_01 | Verify the user can navigate through the Knowledge Base sections', async ({
        page,
        loginPage,
        headerComponent,
        helpCenterPage,
        helpCategoryPage,
    }) => {
        await tags('Help center', 'Positive');
        await severity('normal');
        await description('Verify user can navigate through the Knowledge Base sections by clicking on headings');
        await issue(`${QASE_LINK}/01-33`, 'Help center');
        await tms(`${GOOGLE_DOC_LINK}nc1tclwhmwhq`, 'ATC_07_02_01');
        await epic('Help center');
        test.slow();

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await headerComponent.clickHelpCenterButton();
        await page.waitForURL(URL_ENDPOINT.HelpCenter);

        for (const { title, url } of HELP_PAGE_CATEGORY) {
            await step(`Navigate to "${title}" section`, async () => {
                await helpCenterPage.clickKnowledgeHeader(title);
                await expect(page).toHaveURL(url);
            });

            await step(`Verify that the correct section header for "${title}" appears`, async () => {
                await expect(helpCategoryPage.mainHeading).toHaveText(title);
            });

            if (title === 'Legal') {
                await step(
                    'Verify that relevant articles of search results are displayed on the modal window.',
                    async () => {
                        await helpCategoryPage.clickHelpCategorySearchInput();
                        await helpCategoryPage.waitForHelpCategorySearchPopup();
                        await helpCategoryPage.fillHelpCategorySearchInput(HELP_CATEGORY_SEARCH);
                        /*await helpCategoryPage.waitForHelpCategorySearchPopup();*/
                        await expect(helpCategoryPage.helpCategorySearchPopup).toContainText(
                            new RegExp(HELP_CATEGORY_SEARCH, 'i')
                        );
                        await helpCategoryPage.closeModalWindow();
                    }
                );
            }

            await expect(helpCategoryPage.mainHeading).toBeVisible();
            await expect(helpCategoryPage.mainHeading).toHaveText(title);

            await headerComponent.clickHelpCenterButton();
        }
    });
});
