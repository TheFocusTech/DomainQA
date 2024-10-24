import { test as base } from '@playwright/test';
import HomePage from './pom/pages/HomePage';
import LoginPage from './pom/pages/LoginPage';
import SignupPage from './pom/pages/SignupPage';
import GeneralSettingsPage from './pom/pages/GeneralSettingsPage';
import ChangePasswordModal from './pom/modalWindows/ChangePasswordModal';

export const test = base.extend({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    signupPage: async ({ page }, use) => {
        await use(new SignupPage(page));
    },
    generalSettingsPage: async ({ page }, use) => {
        await use(new GeneralSettingsPage(page));
    },
    changePasswordModal: async ({ page }, use) => {
        await use(new ChangePasswordModal(page));
    },
});
