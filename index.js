import { delay } from './helpers/utils';
import { step } from 'allure-js-commons';

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Retrieves the verification code from an email using the Gmail API.
 * @param {object} auth The authentication object for the Gmail API.
 * @param {string} email The email address of the sender.
 * @param subject
 * @returns {Promise<string|null>} A Promise that resolves with the confirmation link if found, otherwise resolves with null.
 */
export async function getVerificationCodeFromEmail(auth, email, subject) {
    let decodedBody = '';
    await step('Get verification code from email', async () => {
        try {
            const gmail = google.gmail({ version: 'v1', auth });
            console.log('Waiting for the verification code email to arrive...');
            await delay(5000);
            const messagesResponse = await gmail.users.messages.list({
                userId: 'me',
                q: `to:${email} subject:${subject} after:${Math.floor(Date.now() / 1000) - 60}`,
            });
            const messages = messagesResponse.data.messages;
            if (!messages || messages.length === 0) {
                console.warn('No messages found within the last minute.');
                return null;
            }
            await delay(5000);
            const lastMessageResponse = await gmail.users.messages.get({
                userId: 'me',
                id: messages[0].id,
            });
            const message = lastMessageResponse.data;
            const bodyData = message.payload.body.data;
            if (!bodyData) {
                console.warn('Message body not found.');
                return null;
            }
            decodedBody = Buffer.from(bodyData, 'base64').toString().trim();
            console.log('Verification code is:', decodedBody);
            return decodedBody;
        } catch (error) {
            console.error('Error occurred while getting verification code:', error);
            return null;
        }
    });
    return decodedBody;
}
