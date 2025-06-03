const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message,
            value: error.value
        }));
        
        return errorResponse(res, 'Validation failed', 400, validationErrors);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        return errorResponse(res, `${field} '${value}' already exists`, 409);
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        if (err.path === '_id') {
            return errorResponse(res, 'Invalid ID format', 400);
        }
        return errorResponse(res, `Invalid ${err.path}`, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired', 401);
    }

    // Mongoose connection errors
    if (err.name === 'MongoNetworkError') {
        return errorResponse(res, 'Database connection error', 503);
    }

    if (err.name === 'MongoTimeoutError') {
        return errorResponse(res, 'Database timeout error', 503);
    }

    // Express errors
    if (err.type === 'entity.parse.failed') {
        return errorResponse(res, 'Invalid JSON format', 400);
    }

    if (err.type === 'entity.too.large') {
        return errorResponse(res, 'Request payload too large', 413);
    }

    // Default error
    const statusCode = err.statusCode || err.status || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;

    errorResponse(res, message, statusCode);
};

module.exports = errorHandler;
