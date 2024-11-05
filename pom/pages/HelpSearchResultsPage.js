import { step } from 'allure-js-commons';

export default class HelpSearchResultsPage {
    constructor(page) {
        this.page = page;
        
        this.allCategoriesButton = this.page.getByRole('button', {name: 'All Categories'});
        this.categoriesButtons = this.page.locator('.accordion-root_accordion__otv_0 .accordion-segment_accordion-segment__qGMov button');
        this.accordionByCategoryLabel = this.page.getByLabel('Accordion slice trigger');        
        this.accordionByCategoryButton = this.page.locator('.accordion-slice_accordion-slice-header__c6ej2 > button');
        this.categoriesButtonsCount = this.page.locator('.counter-wrapper_counter-wrapper__8GYS8 .counter-wrapper_counter-wrapper__counter__iFP4w');
        this.headerText = this.page.locator('h2.search-results_search-results__title__pdfWS');
    }    
    
    async allInnerTextsCategoriesButtons() {
        return (await this.categoriesButtons.allInnerTexts());

    }

    async clickAccordionByCategoryLabel() {
        await step('Click on "By category" accordion.', async () => {
            await this.accordionByCategoryLabel.click();
        });
    }

    async allInnerTextsCategoriesButtonsCount() {
        await this.categoriesButtonsCount.allInnerTexts();        
    }
    
    async innerTextsHeaderText() {        
        await this.headerText.allInnerTexts();
    }
  
}