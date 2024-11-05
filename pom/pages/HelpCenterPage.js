import { step } from 'allure-js-commons';

export default class HelpCenterPage {
    constructor(page) {
        this.page = page;

        this.searchTermPlaceholder = this.page.getByPlaceholder('Enter the search term');
        // this.searchButton = this.page.getByRole('button', { name: 'Search' });        
    }

    async fillSearchTermPlaceholder(name) {
        await step('Fill in "Enter the search term" input field.', async () => {
            await this.searchTermPlaceholder.fill(name);            
        });
    }
    
    // async clickSearchButton() {
    //     await step('Click on "Search" button.', async () => {            
    //         await this.searchButton.click(); 
    //     });
    // }
    
}