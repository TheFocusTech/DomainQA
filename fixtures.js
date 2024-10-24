import { test as base } from '@playwright/test';
import HomePage from './pom/pages/HomePage';
import LoginPage from './pom/pages/LoginPage';
import SignupPage from './pom/pages/SignupPage';
import HostedZonePage from './pom/pages/HostedZonePage';
import HostedZoneDetailPage from './pom/pages/HostedZoneDetailPage';

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
    hostedZonePage: async ({ page }, use) => {
        await use(new HostedZonePage(page));
    },
    hostedZoneDetailPage: async ({ page }, use) => {
        await use(new HostedZoneDetailPage(page));
    },
});
