import { text } from "stream/consumers";

export default class ToastComponent {
    constructor(page) {
        this.page = page;

        this.toastBody = this.page.locator('.Toastify__toast-body');
        this.promptHZCreated = this.page.getByText('Hosted zone created');
        this.accountDeleted = this.page.getByText('The account will be deleted in 30 days');
        this.accountDeletionCanceled = this.page.getByText('Deletion was cancelled successfully');
    }

    async waitForToastText() {
        await step(`Verify the toast message "${text}" appears.`, async () => {                        
            await toastBody.filter({ hasText: `${text}` }).waitFor({ state: "visible" });
        });
    }
}
