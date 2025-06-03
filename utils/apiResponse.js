/**
 * Standardized API response utility functions
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
    const response = {
        success: true,
        message,
        timestamp: new Date().toISOString()
    };

    if (data !== null) {
        response.data = data;
    }

    res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Array} errors - Array of error details
 */
const errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message,
        timestamp: new Date().toISOString()
    };

    if (errors && errors.length > 0) {
        response.errors = errors;
    }

    // Don't expose sensitive error details in production
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        response.message = 'Internal server error';
    }

    res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination info
 * @param {string} message - Success message
 */
const paginatedResponse = (res, data, pagination, message = 'Data retrieved successfully') => {
    const response = {
        success: true,
        message,
        data,
        pagination: {
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            itemsPerPage: pagination.itemsPerPage,
            hasNextPage: pagination.hasNextPage,
            hasPrevPage: pagination.hasPrevPage
        },
        timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} validationErrors - Array of validation errors
 */
const validationErrorResponse = (res, validationErrors) => {
    const errors = validationErrors.map(error => ({
        field: error.param || error.path,
        message: error.msg || error.message,
        value: error.value
    }));

    errorResponse(res, 'Validation failed', 400, errors);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} resource - Name of the resource not found
 */
const notFoundResponse = (res, resource = 'Resource') => {
    errorResponse(res, `${resource} not found`, 404);
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Unauthorized message
 */
const unauthorizedResponse = (res, message = 'Unauthorized access') => {
    errorResponse(res, message, 401);
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Forbidden message
 */
const forbiddenResponse = (res, message = 'Access forbidden') => {
    errorResponse(res, message, 403);
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse,
    validationErrorResponse,
    notFoundResponse,
    unauthorizedResponse,
    forbiddenResponse
};
