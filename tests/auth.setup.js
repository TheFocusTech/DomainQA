import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { loginUser } from '../helpers/preconditions';

test('SETUP - LOGIN BEFORE ALL TESTS', async ({ page, loginPage, headerComponent }) => {
    await page.goto('/');
    await loginUser(page, headerComponent, loginPage);

    await expect(headerComponent.myProfileButton).toBeVisible();

    await page.context().storageState({ path: 'authState.json' });
});
