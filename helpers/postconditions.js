import { step } from 'allure-js-commons';
import { deleteAllHostedZonesAPI } from '../helpers/apiCalls';

export const deleteAllHostedZones = async (request, headers) => {
    await step('Delete all hosted zones via API.', async () => {
        await deleteAllHostedZonesAPI(request, headers);
    });
};
