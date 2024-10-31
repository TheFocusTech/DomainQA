import { step } from 'allure-js-commons';
import { RANDOM_CHARACTERS } from '../../testData';

export default class HelpCenterPage {
    constructor(page) {
        this.page = page;
        this.helpCenterInput = this.page.getByPlaceholder('Enter the search term');
        this.helpSearchButton = this.page.getByLocator('button[class*="button-accent"]');
    }

    // async fillHelpCenterInput() {
    //     const randomString = await getRandomCharacters(10); // Указан длина строки
    //     await this.page.fill(this.helpCenterInput, randomString); // Исправлено
    // }
    async fillHelpCenterInput() {
        await step('Fill the Help Center input.', async () => {
            await this.helpCenterInput.fill().getByPlaceholder();
        });
    }
    async clickHelpCenterSearchButton() {
        await step('Click search button.', async () => {
            await this.helpSearchButton.click();
        });
    }

}




//getByRole('placeholder', { name: 'Search' });
//     async clickChangeButton() {
//         await step('Click on the "Change" button.', async () => {
//             await this.changeButton.click();
//         });
//     }

