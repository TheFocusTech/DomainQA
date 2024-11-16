import { API_ENDPOINT, NAME_SEARCH, API_HelpSearch } from '../testData';
import { getRandomDomainName } from './utils';
import { step } from 'allure-js-commons';

function getAuthHeaders(headers) {
    const { 'dr.token': authToken, 'dr.scrf-token': xsrfToken, _csrf: csrfCookie } = headers;
    return {
        Authorization: `Bearer ${authToken}`,
        'x-csrf-token': xsrfToken,
        Cookie: `_csrf=${csrfCookie}`,
    };
}

export async function getHostedZonesAPI(request, headers) {
    const authHeaders = getAuthHeaders(headers);
    const url = `${process.env.API_URL}${API_ENDPOINT.getHostedZones}`;

    try {
        const response = await request.get(url, { headers: authHeaders });
        if (!response.ok()) {
            throw new Error(`GET hosted zones request failed with status: ${response.status()}`);
        }
        const hostedZonesData = await response.json();
        const hostedZoneCount = hostedZonesData.meta.total;
        console.log(`Total number of hosted zones: ${hostedZoneCount}`);

        return hostedZonesData;
    } catch (error) {
        console.error(`An error occurred while getting hosted zones: ${error.message}`);
        return null;
    }
}

export async function createHostedZoneAPI(request, headers) {
    const authHeaders = getAuthHeaders(headers);
    const domainName = await getRandomDomainName();
    const url = `${process.env.API_URL}${API_ENDPOINT.createHostedZone}`;

    try {
        const response = await request.post(url, {
            headers: authHeaders,
            data: { domain: domainName },
        });
        if (!response.ok()) {
            throw new Error(
                `POST hosted zones request failed with status: ${response.status()} for domain: ${domainName}`
            );
        }
        const createHostedZoneData = await response.json();
        const hostedZoneId = createHostedZoneData.id;
        console.log(`Created hosted zone ${domainName} with id ${hostedZoneId}`);
        return createHostedZoneData;
    } catch (error) {
        console.error(`An error occurred while creating hosted zone: ${error.message}`);
        return null;
    }
}

export async function deleteHostedZoneAPI(request, id, headers) {
    const authHeaders = getAuthHeaders(headers);
    const url = `${process.env.API_URL}${API_ENDPOINT.deleteHostedZone}${id}`;

    try {
        const response = await request.delete(url, { headers: authHeaders });
        if (!response.ok()) {
            throw new Error(`DELETE hosted zone ${id} request failed with status: ${response.status()}`);
        }
    } catch (error) {
        console.error(`An error occurred while deleting hosted zone: ${error.message}`);
    }
}

export async function getDnsRecords(request, hostedZoneId, headers) {
    const authHeaders = getAuthHeaders(headers);
    const url = `${process.env.API_URL}/users/hosted-zones/${hostedZoneId}${API_ENDPOINT.resourceRecords}`;
    try {
        const response = await request.get(url, { headers: authHeaders });
        if (!response.ok()) {
            throw new Error(`GET dns records request failed with status: ${response.status()}`);
        }
        const dnsRecordData = await response.json();
        const resourceRecords = dnsRecordData.resourceRecords;
        return resourceRecords;
    } catch (error) {
        console.error(`An error occurred while getting dns records: ${error.message}`);
        return null;
    }
}

export async function deleteAllHostedZonesAPI(request, headers) {
    try {
        const getZonesData = await getHostedZonesAPI(request, headers);
        const zoneIds = getZonesData.results.map((zone) => zone.id);

        for (const id of zoneIds) {
            await deleteHostedZoneAPI(request, id, headers);
        }
        const remainingZonesData = await getHostedZonesAPI(request, headers);
        remainingZonesData.results.length === 0
            ? console.log('All zones deleted')
            : console.error('Not all zones deleted');
    } catch (error) {
        console.error(`An error occurred while deleting all hosted zones: ${error.message}`);
    }
}

export async function getCategoriesHelpSearchAPI(request, key) {
    try {
        const response = await request.get(`${API_HelpSearch.URL}${API_HelpSearch.ENDPOINT_Categ}`, {
            headers: {
                authorization: `${API_HelpSearch.token}`,
            },
        });
        if (!response.ok()) {
            throw new Error(`GET Categories request failed with status: ${response.status()}`);
        }
        const responseBody = await response.json();
        const obj = [];
        for (let i in responseBody) {
            obj[i] = responseBody[i][key];
        }
        return obj;
    } catch (error) {
        console.error(`An error occurred while sending the category list request: ${error.message}`);
    }
}

export async function getResponseHelpSearchAPI(request, idAllCategories, key) {
    try {
        const API_URL_ENDPOINT_HelpSearch = `/api/v2/search/solutions?category_id=${idAllCategories}&term=${NAME_SEARCH}`;
        const response = await request.get(`${API_HelpSearch.URL}${API_URL_ENDPOINT_HelpSearch}`, {
            headers: {
                authorization: `${API_HelpSearch.token}`,
                accept: 'application/json',
            },
        });
        if (!response.ok()) {
            throw new Error(`GET Categories ID request failed with status: ${response.status()}`);
        }
        const responseBody = await response.json();
        let obj = [];
        for (let i in responseBody) {
            obj[i] = responseBody[i][key];
        }
        obj = Array.from(new Set(obj));
        return obj;
    } catch (error) {
        console.error(`An error occurred while sending the category ID request: ${error.message}`);
    }
}

export async function signInRequest(request, email, password) {
    await step('Precondition: Sign In to collect tokens', async () => {
        try {
            const signInResponse = await request.post(`${process.env.API_URL}${API_ENDPOINT.login}`, {
                data: {
                    email: email,
                    password: password,
                },
            });

            if (!signInResponse.ok()) {
                throw new Error(`Failed to login: ${signInResponse.statusText()}`);
            }

            const signInData = await signInResponse.json();
            console.log('User logged in successfully with id ' + signInData.profile.id);

            process.env.ACCESS_TOKEN = signInData.accessToken;
            process.env.CSRF_TOKEN = signInData.csrfToken;

            console.log('Access Token:', process.env.ACCESS_TOKEN);
            console.log('CSRF Token:', process.env.CSRF_TOKEN);
        } catch (error) {
            console.error(`An error occurred during login: ${error.message}`);
        }
    });
}

export async function getVerificationCodeRequest(request) {
    await step('Get verification code from response', async () => {
        try {
            if (!process.env.ACCESS_TOKEN || !process.env.CSRF_TOKEN) {
                throw new Error('Tokens are not set. Please sign in first.');
            }

            const response = await request.get(`${process.env.API_URL}${API_ENDPOINT.verificationCode}`, {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                    'x-csrf-token': process.env.CSRF_TOKEN,
                },
            });

            if (!response.ok()) {
                throw new Error(`Failed to get verification code: ${response.statusText()}`);
            }

            const responseBody = await response.json();
            const verificationCode = responseBody.verificationCode;

            if (!verificationCode) {
                throw new Error('Verification code not found in response.');
            }

            return verificationCode;
        } catch (error) {
            console.error(`An error occurred while retrieving the verification code: ${error.message}`);
        }
    });
}

export async function deleteUserRequest(request, email, password) {
    await step('Precondition: Delete earlier created user', async () => {
        try {
            const deleteResponse = await request.post(`${process.env.API_URL}${API_ENDPOINT.userDelete}`, {
                data: {
                    email: email,
                    password: password,
                },
            });
            if (!deleteResponse.ok()) {
                console.error('Failed to delete: No user with this email exists.');
            } else {
                console.log('User was successfully deleted');
            }
        } catch (error) {
            console.error(`An error occurred during login: ${error.message}`);
        }
    });
}

export async function deleteDnsRecordAPI(request, recordId, hostedZoneId, headers) {
    const authHeaders = getAuthHeaders(headers);
    const url = `${process.env.API_URL}${API_ENDPOINT.deleteResourceRecord(recordId, hostedZoneId)}`;
    try {
        const response = await request.delete(url, { headers: authHeaders });
        if (!response.ok()) {
            throw new Error(`DELETE DNS record ${recordId} request failed with status: ${response.status()}`);
        }
    } catch (error) {
        console.error(`An error occurred while deleting DNS record: ${error.message}`);
    }
}
