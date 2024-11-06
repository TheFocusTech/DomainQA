import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, HEADER_LINKS, ACCESSIBLE_PAGE_TITLE } from '../testData';
import { loginUser } from '../helpers/preconditions';

const navigationActions = {
    'Registered domains': async ({ registeredDomainsPage, heading, title, description, buttons }) => {
        await registeredDomainsPage.verifyRegisteredDomainsPage(heading, title, description, buttons);
    },
    'Hosted zones': async ({ hostedZonesPage, heading, title, description, buttons }) => {
        await hostedZonesPage.verifyHostedZonesPage(heading, title, description, buttons);
    },
    Transfer: async ({ transferPage, heading, buttons }) => {
        await transferPage.verifyTransferPage(heading, buttons);
    },
    WHOIS: async ({ whoisPage, heading, buttons }) => {
        await whoisPage.verifyWhoisPage(heading, buttons);
    },
    Hosting: async ({ hostingPage, heading, title, description, buttons }) => {
        await hostingPage.verifyHostingPage(heading, title, description, buttons);
    },
    'SSL certificates': async ({ sslCertificatesPage, heading, buttons }) => {
        await sslCertificatesPage.verifySslCertificatesPage(heading, buttons);
    },
    // Email: async ({ emailPage, heading, title, description, buttons }) => {
    //     await emailPage.verifyEmailPage(heading, title, description, buttons);
    // },
    Blog: async ({ blogPage, heading, title, description, buttons }) => {
        await blogPage.verifyBlogPage(heading, title, description, buttons);
    },
    Logo: async ({ homePage, heading, buttons }) => {
        await homePage.verifyHomePage(heading, buttons);
    },
    'Help center': async ({ helpCenterPage, heading, buttons }) => {
        await helpCenterPage.verifyHelpCenterPage(heading, buttons);
    },
    Home: async ({ homePage, heading, buttons }) => {
        await homePage.verifyHomePage(heading, buttons);
    },
};

const navigationToHomePageActions = {
    fromFooterLogo: async ({ footerComponent }) => {
        await footerComponent.clickLogo();
    },
    fromFooterDomainSearch: async ({ footerComponent }) => {
        await footerComponent.clickDomainSearchLink();
    },
    fromHeader: async ({ headerComponent, registeredDomainsPage }) => {
        await headerComponent.clickRegisteredDomainsButton();
        await registeredDomainsPage.clickGetNewDomainButton();
    },
};

test.describe('Navigation', () => {
    test.beforeEach(async ({ page, headerComponent, loginPage }) => {
        await step('Preconditions:', async () => {
            await loginUser(page, headerComponent, loginPage);
        });
    });

    let testNumber = 0;
    HEADER_LINKS.forEach((link) => {
        if (link.type === 'direct') {
            testNumber++;
            test(`TC_03_01_${String(testNumber).padStart(2, '0')} |  Verify that user can navigate through Header links ${link.name}`, async ({
                page,
                headerComponent,
                blogPage,
                homePage,
                helpCenterPage,
            }) => {
                test.slow();
                await tags('Navigation', 'Positive');
                await severity('critical');
                await description('To verify that user can navigate through Header links.');
                await issue(`${QASE_LINK}`, 'Navigation');
                await tms(`${GOOGLE_DOC_LINK}qept55xhhmbh`, 'ATC_03_01');
                await epic('Navigation');

                if (link.name == 'Blog') {
                    await headerComponent.clickBlogButton();
                } else if (link.name == 'Logo') {
                    await headerComponent.clickLogo();
                } else {
                    await headerComponent.clickLink(link.name);
                }
                await step(`Verify user is redirect to ${link.name} page`, async () => {
                    await expect(page).toHaveURL(link.expectedUrl);
                });
                await navigationActions[link.name]({
                    headerComponent,
                    blogPage,
                    homePage,
                    helpCenterPage,
                    heading: link.heading,
                    title: link.result,
                    description: link.text,
                    buttons: link.buttons,
                });
            });
        } else if (link.type === 'dropdown') {
            link.links.forEach((dropdownLink) => {
                testNumber++;
                test(`TC_03_01_${String(testNumber).padStart(2, '0')} |  Verify that user can navigate through Header links ${dropdownLink.name}`, async ({
                    page,
                    headerComponent,
                    registeredDomainsPage,
                    hostedZonesPage,
                    transferPage,
                    whoisPage,
                    hostingPage,
                    sslCertificatesPage,
                }) => {
                    test.slow();
                    await tags('Navigation', 'Positive');
                    await severity('critical');
                    await description('To verify that user can navigate through Header links.');
                    await issue(`${QASE_LINK}`, 'Navigation');
                    await tms(`${GOOGLE_DOC_LINK}qept55xhhmbh`, 'ATC_03_01');
                    await epic('Navigation');
                    await headerComponent.clickButton(link.trigger);

                    await headerComponent.clickLink(dropdownLink.name);
                    await page.waitForURL(dropdownLink.expectedUrl);
                    await step(`Verify user is redirect to ${dropdownLink.name} page`, async () => {
                        await expect(page).toHaveURL(dropdownLink.expectedUrl);
                    });
                    await navigationActions[dropdownLink.name]({
                        headerComponent,
                        registeredDomainsPage,
                        hostedZonesPage,
                        transferPage,
                        whoisPage,
                        hostingPage,
                        sslCertificatesPage,
                        heading: dropdownLink.heading,
                        title: dropdownLink.result,
                        description: dropdownLink.text,
                        buttons: dropdownLink.buttons,
                    });
                    await headerComponent.clickButton(link.trigger);
                });
            });
        }
    });

    Object.entries(navigationToHomePageActions).forEach(([name, action], index) => {
        test(`TC_03_02_0${index + 1} | Verify navigation to Home page from ${name}`, async ({
            page,
            headerComponent,
            footerComponent,
            homePage,
            registeredDomainsPage,
        }) => {
            await tags('Navigation', 'Positive');
            await severity('critical');
            await description(`To verify that user can navigate to Home page from ${name}.`);
            await issue(`${QASE_LINK}/01-5`, 'Home page');
            await tms(`${GOOGLE_DOC_LINK}`, 'ATC_03_02');
            await epic('Navigation');

            await action({ headerComponent, footerComponent, registeredDomainsPage });

            await step('Verify user is redirected to Home page', async () => {
                await expect(page).toHaveURL('/');
            });
            await step(`Verify that Home page has "${ACCESSIBLE_PAGE_TITLE.HomePage}" heading.`, async () => {
                await expect(homePage.mainHeading).toHaveText(ACCESSIBLE_PAGE_TITLE.HomePage);
            });
        });
    });
});
