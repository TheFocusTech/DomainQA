export default class SettingsNotificationsPage {
    constructor(page) {
        this.page = page;

        this.notificationsHeading = this.page.getByRole('heading', { name: 'Manage your notifications' });
        this.notificationsTable = this.page.getByRole('table');
        this.notificationsTableRow = this.notificationsTable.locator('tbody tr');
        this.notificationsType = this.notificationsTableRow.getByRole('heading');
        this.emailNotificationsCheckbox = this.notificationsTableRow.locator('td:last-child input');
        this.browserNotificationsCheckbox = this.notificationsTableRow.locator('td:nth-of-type(even) input');
        this.browserNotifications = this.notificationsTableRow.locator('td:nth-child(2) label');
    }
}
