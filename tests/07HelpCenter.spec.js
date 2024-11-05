import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT, HELP_SEARCH_POPUP_ALERT, NAME_SEARCH } from '../testData';
import { loginUser, goToHelpSearchResultsPage } from '../helpers/preconditions';
import { getCategoriesHelpSearchAPI, getResponseHelpSearchAPI } from "../helpers/apiCalls";
import { getResultVerifySearchAPI } from "../helpers/utils";

test.describe('Help Center', () => {
    test.use({ viewport: { width: 1600, height: 1200 } });
    // test.describe.configure({ retries: 2, timeout: 60000 });

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

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await step('Verify the user is redirected to help center page.', async () => {
            await headerComponent.clickHelpCenterButton();
            await expect(page).toHaveURL(URL_ENDPOINT.HelpCenter);
        });

        const randomString = await helpCenterPage.fillSearchInput();

        await step('Verify the user gets popup alert-message and empty list after input.', async () => {
            await expect(helpCenterPage.helpSearchPopup).toBeVisible();
            await expect(helpCenterPage.helpSearchPopupAlert).toHaveText(HELP_SEARCH_POPUP_ALERT);
        });

        await step('Verify the user redirects to search page and gets alert-message.', async () => {
            await helpCenterPage.clickHelpCenterSearchButton();
            const expectedSearchURL = `${process.env.URL}${URL_ENDPOINT.HelpCenterSearch}?search=${randomString}`;
            expect(page).toHaveURL(expectedSearchURL);
            const alertText = await helpCenterPage.helpSearchPopupAlert.innerText();
            const alertNormalizedText = alertText.replace(/“|”/g, '"');
            expect(alertNormalizedText).toContain(`No results for "${randomString}"`);
        });
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
        await issue(`${QASE_LINK}suite=1&case=32`, 'Help center');
        await tms(`${GOOGLE_DOC_LINK}xqp3coi93i74`, 'ATC_07_01_05');
        await epic('Help center');
             
        test.slow();
        await step('Preconditions:', async () => {
            await loginUser(page, headerComponent, loginPage);
            await page.waitForURL(process.env.URL); 
        });        
        await goToHelpSearchResultsPage(page, headerComponent, helpCenterPage);         
        
        //Шаги:             
        await helpSearchResultsPage.allCategoriesButton.waitFor({state: 'visible'});        
        
        // const categName = await getCategoriesHelpSearchAPI(request, 'name');
        // const categId = await getCategoriesHelpSearchAPI(request, 'id'); 

        // await step('Verify category "All Categories" contains only names categories from the list of categories in the articles.', async () => {
        //     const allCategories = await getResponseHelpSearchAPI(request, '', 'category_name');
        //     console.log('Проверка, что категория "All Categories" содержит в статьях только названия категорий из списка категорий:');
        //     await expect((await getResultVerifySearchAPI(categName, allCategories)).toString()).toEqual('true');
        // }); 
        
        // await step('Verify  other categories contain only the names of their categories in the articles.', async () => {
        //     console.log('Проверка, что другие категории содержат в статьях только названия своих категорий:');
        //     for (let i = 0; i < categId.length; i++) {          
        //         const specificCategory = await getResponseHelpSearchAPI(request, `${categId[i]}`, 'category_name');        
        //         if (specificCategory == '') { continue;}            
        //         else {    
        //             console.log(`Проверка для ${categName[i]}:`);
        //             await expect((await getResultVerifySearchAPI(categName[i], specificCategory)).toString()).toEqual('true');
        //         }  
        //     }
        // }); 
        
        //UI массив с названиями категорий.          
        const textButtons = await helpSearchResultsPage.allInnerTextsCategoriesButtons();
        console.log('UI массив с названиями категорий:', textButtons);

        // async function resultCountCategoriesSearch(textButtons) {
        //     const count = await helpSearchResultsPage.allInnerTextsCategoriesButtonsCount();            
        //     console.log(count);
        //     const countNew = [];
        //     const headerAll = [];
        //     for (let text of count) {
        //         countNew.push(text.replace('(','').replace(')',''));
        //     }  
        //     //бежим по категориям слева, для каждого клика (где не 0) сравниваем, что счетчик содержится в заголовке
        //     for (let i=0; i< textButtons.length; i++) {
        //         if (countNew[i] == 0) continue; 
        //         else { 
        //             await page.getByRole('button', {name: `${textButtons[i]}`}).click();
        //             //массив из одного элемента - заголовок               
        //             let header = await helpSearchResultsPage.innerTextsHeaderText();
        //             headerAll.push(header);                    
        //         }                
        //     }  

        //     console.log(headerAll);
        //     return headerAll;
        // }
        // resultCountCategoriesSearch(textButtons);
        
        //Ниже код был для проверки по счетчику:
        //массив со счетчиком категорий в виде "(30)"        
        const count = await helpSearchResultsPage.allInnerTextsCategoriesButtonsCount();            
        //меняем массив на массив со счетчиком категорий в виде "30"
        const countNew = [];
        for (let text of count) {
            countNew.push(text.replace('(','').replace(')',''));
        }        

        //бежим по категориям слева, для каждого клика (где не 0) сравниваем, что счетчик содержится в заголовке
        for (let i=0; i< textButtons.length; i++) {
            if (countNew[i] == 0) continue; 
            else { 
                await page.getByRole('button', {name: `${textButtons[i]}`}).click();
                //массив из одного элемента - заголовок               
                let header = await helpSearchResultsPage.innerTextsHeaderText();
                console.log(header);
                expect(header.includes(countNew[i])).toEqual(true);
            }                
        }  


        // await step('Verify Dropdown “By Category” is hidden.', async () => {
        //     await helpSearchResultsPage.clickAccordionByCategoryLabel();           
        //     await expect(helpSearchResultsPage.accordionByCategoryButton).not.toHaveClass('accordion-slice_accordion-slice-header__trigger--active__xgc2K');            
        // });
              
    });

    test('TC_07_01_04 | Verify Search articles with Valid Query', async ({
        page, 
        loginPage, 
        headerComponent, 
        helpCenterPage, 
        helpSearchResultsPage, 
        request,
    }) => {
        await tags('Help center', 'Positive');
        await severity('normal');
        await description('Verify that relevant articles are displayed.');
        await issue(`${QASE_LINK}suite=1&case=32`, 'Help center');
        await tms(`${GOOGLE_DOC_LINK}xvx5scpwj3i2`, 'ATC_07_01_04');
        await epic('Help center');
                
        await step('Preconditions:', async () => {
            await loginUser(page, headerComponent, loginPage);
            await page.waitForURL(process.env.URL); 
        });        
        //завернуть в функцию и добавить в utils
        await step(`Verify all articles contain a search query ${NAME_SEARCH}.`, async () => {
            console.log(`Проверка, что все статьи (заголовок / описание) содержат поисковый запрос ${NAME_SEARCH}:`);
            const descriptionSearchPage = await getResponseHelpSearchAPI(request, '', 'description');
            const descriptionTextSearchPage = await getResponseHelpSearchAPI(request, '', 'description_text');   
            let result = '';
            if ((descriptionSearchPage[0].toLowerCase().includes(`${NAME_SEARCH}`.toLowerCase()) === true) || 
                (descriptionTextSearchPage[0].toLowerCase().includes(`${NAME_SEARCH}`.toLowerCase()) === true)) {
                    result = 'true'; 
                }
            else result = 'false'; 

            console.log(result);       
            await expect(result).toEqual('true');                      
        });
    }); 
       
}) 