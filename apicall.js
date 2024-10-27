import { expect } from '@playwright/test';

export async function signInUserApi(request) {
    try {
        const getSignInResponse = await request.post('https://staging-api.trustname.com/users/auth/sign-in', {
            //(`${process.env.API_URL}${API_URL_END_POINTS.signInEndPoint}`, {
            data: {
                email: process.env.USER_EMAIL,
                password: process.env.USER_PASSWORD,
            },
        });
        expect(getSignInResponse.ok()).toBeTruthy();

        return getSignInResponse;
    } catch (error) {
        console.error(`An error occurred during login: ${error.message}`);
    }
}
