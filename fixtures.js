import { test as base } from '@playwright/test';
import HomePage from './pom/pages/HomePage';
import LoginPage from './pom/pages/LoginPage';
import SignupPage from './pom/pages/SignupPage';
import SettingsGeneralPage from './pom/pages/SettingsGeneralPage';
import ChangePasswordModal from './pom/modalWindows/ChangePasswordModal';
import HeaderComponent from './pom/components/HeaderComponent';
import ToastComponent from './pom/components/ToastComponent';
import HostedZonesPage from './pom/pages/HostedZonesPage';
import HostedZonesDetailPage from './pom/pages/HostedZonesDetailPage';

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
    headerComponent: async ({ page }, use) => {
        await use(new HeaderComponent(page));
    },
    settingsGeneralPage: async ({ page }, use) => {
        await use(new SettingsGeneralPage(page));
    },
    changePasswordModal: async ({ page }, use) => {
        await use(new ChangePasswordModal(page));
    },
    toastComponent: async ({ page }, use) => {
        await use(new ToastComponent(page));
    },
    hostedZonesPage: async ({ page }, use) => {
        await use(new HostedZonesPage(page));
    },
    hostedZonesDetailPage: async ({ page }, use) => {
        await use(new HostedZonesDetailPage(page));
    },
});
