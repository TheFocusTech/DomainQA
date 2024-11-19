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
import DnsRecordModal from './pom/modalWindows/DnsRecordModal';
import CreateHostedZoneModal from './pom/modalWindows/CreateHostedZoneModal';
import DeleteHostedZoneModal from './pom/modalWindows/DeleteHostedZoneModal';
import AccountDeletionModal from './pom/modalWindows/AccountDeletionModal';
import AcDeleteConfirmationModal from './pom/modalWindows/AcDeleteConfirmationModal';
import CancelDeletionModal from './pom/modalWindows/CancelDeletionModal';
import WhoisSearchResultPage from './pom/pages/WhoisSearchResultPage';
import DomainAvailabilityPage from './pom/pages/DomainAvailabilityPage';
import WhoisPage from './pom/pages/WhoisPage';
import FooterComponent from './pom/components/FooterComponent';
import PageTitleComponent from './pom/components/PageTitleComponent';
import HelpCenterPage from './pom/pages/HelpCenterPage';
import EnableDnssecModal from './pom/modalWindows/EnableDnssecModal';
import TwoFactorAuthModal from './pom/modalWindows/TwoFactorAuthModal';
import RegisteredDomainsPage from './pom/pages/RegisteredDomainsPage';
import TransferPage from './pom/pages/TransferPage';
import HostingPage from './pom/pages/HostingPage';
import SslCertificatesPage from './pom/pages/SslCertificatesPage';
import BlogPage from './pom/pages/BlogPage';
import SettingsNotificationsPage from './pom/pages/SettingsNotificationsPage';
import HelpSearchResultsPage from './pom/pages/HelpSearchResultsPage';
import ContactDetailsPage from './pom/pages/ContactDetailsPage';
import ContactsPage from './pom/pages/ContactsPage';
import ForgotPasswordPage from './pom/pages/ForgotPasswordPage';
import DeleteDNSmodal from './pom/modalWindows/DeleteDNSmodal';
import ConfirmEmailPage from './pom/pages/ConfirmEmailPage';
import CreateContactPage from './pom/pages/CreateContactPage';
import AdvancedSearchModal from './pom/modalWindows/AdvancedSearchModal';
import BillingModal from './pom/modalWindows/BillingModal';
import BlogArticlePage from './pom/pages/BlogArticlePage';

export const test = base.extend({
    /** @type { HomePage } */
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    /** @type { LoginPage } */
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    /** @type { SignupPage } */
    signupPage: async ({ page }, use) => {
        await use(new SignupPage(page));
    },
    /** @type { HeaderComponent } */
    headerComponent: async ({ page }, use) => {
        await use(new HeaderComponent(page));
    },
    /** @type { SettingsGeneralPage } */
    settingsGeneralPage: async ({ page }, use) => {
        await use(new SettingsGeneralPage(page));
    },
    /** @type { ChangePasswordModal } */
    changePasswordModal: async ({ page }, use) => {
        await use(new ChangePasswordModal(page));
    },
    /** @type { ToastComponent } */
    toastComponent: async ({ page }, use) => {
        await use(new ToastComponent(page));
    },
    /** @type { HostedZonesPage } */
    hostedZonesPage: async ({ page }, use) => {
        await use(new HostedZonesPage(page));
    },
    /** @type { HostedZonesDetailPage } */
    hostedZonesDetailPage: async ({ page }, use) => {
        await use(new HostedZonesDetailPage(page));
    },
    /** @type { DnsRecordModal } */
    dnsRecordModal: async ({ page }, use) => {
        await use(new DnsRecordModal(page));
    },
    /** @type { CreateHostedZoneModal } */
    createHostedZoneModal: async ({ page }, use) => {
        await use(new CreateHostedZoneModal(page));
    },
    /** @type { DeleteHostedZoneModal } */
    deleteHostedZoneModal: async ({ page }, use) => {
        await use(new DeleteHostedZoneModal(page));
    },

    /** @type { AccountDeletionModal } */
    accountDeletionModal: async ({ page }, use) => {
        await use(new AccountDeletionModal(page));
    },
    /** @type { AcDeleteConfirmationModal } */
    acDeleteConfirmationModal: async ({ page }, use) => {
        await use(new AcDeleteConfirmationModal(page));
    },
    /** @type { CancelDeletionModal } */
    cancelDeletionModal: async ({ page }, use) => {
        await use(new CancelDeletionModal(page));
    },
    /** @type { WhoisSearchResultPage } */
    whoisSearchResultPage: async ({ page }, use) => {
        await use(new WhoisSearchResultPage(page));
    },
    /** @type { DomainAvailabilityPage } */
    domainAvailabilityPage: async ({ page }, use) => {
        await use(new DomainAvailabilityPage(page));
    },
    /** @type { WhoisPage } */
    whoisPage: async ({ page }, use) => {
        await use(new WhoisPage(page));
    },
    /** @type { FooterComponent } */
    footerComponent: async ({ page }, use) => {
        await use(new FooterComponent(page));
    },
    /** @type { PageTitleComponent } */
    pageTitleComponent: async ({ page }, use) => {
        await use(new PageTitleComponent(page));
    },

    /** @type { HelpCenterPage } */
    helpCenterPage: async ({ page }, use) => {
        await use(new HelpCenterPage(page));
    },
    /** @type { EnableDnssecModal } */
    enableDnssecModal: async ({ page }, use) => {
        await use(new EnableDnssecModal(page));
    },
    /** @type { TwoFactorAuthModal } */
    twoFactorAuthModal: async ({ page }, use) => {
        await use(new TwoFactorAuthModal(page));
    },
    /** @type { RegisteredDomainsPage } */
    registeredDomainsPage: async ({ page }, use) => {
        await use(new RegisteredDomainsPage(page));
    },
    /** @type { TransferPage } */
    transferPage: async ({ page }, use) => {
        await use(new TransferPage(page));
    },
    /** @type { HostingPage } */
    hostingPage: async ({ page }, use) => {
        await use(new HostingPage(page));
    },
    /** @type { SslCertificatesPage } */
    sslCertificatesPage: async ({ page }, use) => {
        await use(new SslCertificatesPage(page));
    },
    /** @type { BlogPage } */
    blogPage: async ({ page }, use) => {
        await use(new BlogPage(page));
    },
    /** @type { SettingsNotificationsPage } */
    settingsNotificationsPage: async ({ page }, use) => {
        await use(new SettingsNotificationsPage(page));
    },
    /** @type { HelpSearchResultsPage } */
    helpSearchResultsPage: async ({ page }, use) => {
        await use(new HelpSearchResultsPage(page));
    },
    /** @type { ContactsPage } */
    contactsPage: async ({ page }, use) => {
        await use(new ContactsPage(page));
    },
    /** @type { ContactDetailsPage } */
    contactDetailsPage: async ({ page }, use) => {
        await use(new ContactDetailsPage(page));
    },
    /** @type { ForgotPasswordPage } */
    forgotPasswordPage: async ({ page }, use) => {
        await use(new ForgotPasswordPage(page));
    },
    /** @type { DeleteDNSmodal } */
    deleteDNSmodal: async ({ page }, use) => {
        await use(new DeleteDNSmodal(page));
    },
    /** @type { ConfirmEmailPage } */
    confirmEmailPage: async ({ page }, use) => {
        await use(new ConfirmEmailPage(page));
    },
    /** @type { CreateContactPage } */
    createContactPage: async ({ page }, use) => {
        await use(new CreateContactPage(page));
    },
    /** @type { AdvancedSearchModal } */
    advancedSearchModal: async ({ page }, use) => {
        await use(new AdvancedSearchModal(page));
    },
    /** @type { BillingModal } */
    billingModal: async ({ page }, use) => {
        await use(new BillingModal(page));
    },
    /** @type { BlogArticlePage } */
    blogArticlePage: async ({ page }, use) => {
        await use(new BlogArticlePage(page));
    },
});
