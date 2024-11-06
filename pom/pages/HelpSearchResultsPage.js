import { step } from 'allure-js-commons';

export default class HelpSearchResultsPage {
    constructor(page) {
        this.page = page;

        this.allCategoriesButton = this.page.getByRole('button', { name: 'All Categories' });   
        this.categoriesButtons = this.page.locator('[class*= "accordion-segment_accordion-segment"]');     
        this.accordionByCategoryLabel = this.page.getByLabel('Accordion slice trigger');        
        this.accordionByCategoryButton = this.page.locator('[class*="accordion-slice_accordion-slice-header"] > button');
        this.headerText = this.page.locator('h2[class*="search-results_search-results__title"]');               
    } 

    async allInnerTextsCategoriesButtons() {        
        return (await this.categoriesButtons.allInnerTexts());
    }

    async clickAccordionByCategoryLabel() {
        await step('Click on "By category" accordion.', async () => {
            await this.accordionByCategoryLabel.click();
        });
    }
    
    async innerTextsHeaderText() {        
        return (await this.headerText.allInnerTexts());
    }
}
