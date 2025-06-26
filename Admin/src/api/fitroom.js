const apiKey = '9cf263b71073462aa9f39b7f26beb98f390318e0e8e9fa06546434ebb7ef3bf2'; // TODO: Move to a secure environment variable
const baseUrl = 'https://platform.fitroom.app/api/tryon';

/**
 * Validates a model image before try-on.
 * @param {File} modelImage - The image of the model to validate.
 * @returns {Promise<any>} The validation result from the API.
 */
export const validateModelImage = async (modelImage) => {
    const formData = new FormData();
    formData.append('input_image', modelImage);

    const response = await fetch(`${baseUrl}/input_check/v1/model`, {
        method: 'POST',
        headers: {
            'X-API-KEY': apiKey,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to validate model image' }));
        throw new Error(errorData.error || 'Failed to validate model image');
    }

    return response.json();
};

/**
 * Validates a clothing image before try-on.
 * @param {File} clothImage - The image of the clothing to validate.
 * @returns {Promise<any>} The validation result from the API.
 */
export const validateClothImage = async (clothImage) => {
    const formData = new FormData();
    formData.append('input_image', clothImage);

    const response = await fetch(`${baseUrl}/input_check/v1/clothes`, {
        method: 'POST',
        headers: {
            'X-API-KEY': apiKey,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to validate cloth image' }));
        throw new Error(errorData.error || 'Failed to validate cloth image');
    }

    return response.json();
};

/**
 * Creates a virtual try-on task.
 * @param {File} modelImage - The image of the model.
 * @param {File} clothImage - The image of the clothing.
 * @param {string} clothType - The type of clothing ('upper', 'lower', 'full_set', 'combo').
 * @param {File} [lowerClothImage] - The image of the lower clothing (for 'combo' type).
 * @returns {Promise<any>} The response from the API.
 */
export const createTryOnTask = async (modelImage, clothImage, clothType, lowerClothImage) => {
    const formData = new FormData();
    formData.append('model_image', modelImage);
    formData.append('cloth_image', clothImage);
    formData.append('cloth_type', clothType);

    if (clothType === 'combo' && lowerClothImage) {
        formData.append('lower_cloth_image', lowerClothImage);
    }

    const response = await fetch(`${baseUrl}/v2/tasks`, {
        method: 'POST',
        headers: {
            'X-API-KEY': apiKey,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create try-on task');
    }

    return response.json();
};

/**
 * Retrieves the status of a try-on task.
 * @param {string} taskId - The ID of the task.
 * @returns {Promise<any>} The response from the API.
 */
export const getTaskStatus = async (taskId) => {
    const response = await fetch(`${baseUrl}/v2/tasks/${taskId}`,
        {
            headers: {
                'X-API-KEY': apiKey,
            },
        });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get task status');
    }

    return response.json();
};
