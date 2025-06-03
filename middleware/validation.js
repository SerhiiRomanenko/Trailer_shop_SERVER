const { body, validationResult } = require('express-validator');

// Validation rules for creating a trailer
const validateTrailer = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Name must be between 3 and 200 characters')
        .trim(),
    
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .trim(),
    
    body('shortDescription')
        .notEmpty()
        .withMessage('Short description is required')
        .isLength({ max: 500 })
        .withMessage('Short description cannot exceed 500 characters')
        .trim(),
    
    body('brand')
        .notEmpty()
        .withMessage('Brand is required')
        .isLength({ max: 100 })
        .withMessage('Brand cannot exceed 100 characters')
        .trim(),
    
    body('model')
        .notEmpty()
        .withMessage('Model is required')
        .isLength({ max: 100 })
        .withMessage('Model cannot exceed 100 characters')
        .trim(),
    
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .isIn(['Легкові причепи', 'Вантажні причепи', 'Спеціальні причепи', 'Будівельні причепи', 'Причепи для човнів'])
        .withMessage('Invalid category'),
    
    body('price')
        .isNumeric()
        .withMessage('Price must be a number')
        .isFloat({ min: 0 })
        .withMessage('Price must be positive'),
    
    body('currency')
        .optional()
        .isIn(['UAH', 'USD', 'EUR'])
        .withMessage('Invalid currency'),
    
    body('quantity')
        .isNumeric()
        .withMessage('Quantity must be a number')
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
    
    body('images')
        .optional()
        .isArray()
        .withMessage('Images must be an array'),
    
    body('images.*')
        .optional()
        .isURL()
        .withMessage('Each image must be a valid URL'),
    
    body('specifications')
        .optional()
        .isArray()
        .withMessage('Specifications must be an array'),
    
    body('specifications.*.name')
        .optional()
        .notEmpty()
        .withMessage('Specification name is required'),
    
    body('specifications.*.value')
        .optional()
        .notEmpty()
        .withMessage('Specification value is required'),
    
    body('metaTitle')
        .optional()
        .isLength({ max: 160 })
        .withMessage('Meta title cannot exceed 160 characters')
        .trim(),
    
    body('metaDescription')
        .optional()
        .isLength({ max: 320 })
        .withMessage('Meta description cannot exceed 320 characters')
        .trim(),
    
    body('keywords')
        .optional()
        .isArray()
        .withMessage('Keywords must be an array'),
    
    body('isFeatured')
        .optional()
        .isBoolean()
        .withMessage('isFeatured must be a boolean'),
    
    body('inStock')
        .optional()
        .isBoolean()
        .withMessage('inStock must be a boolean')
];

// Validation rules for updating a trailer (all fields optional)
const validateTrailerUpdate = [
    body('name')
        .optional()
        .isLength({ min: 3, max: 200 })
        .withMessage('Name must be between 3 and 200 characters')
        .trim(),
    
    body('description')
        .optional()
        .trim(),
    
    body('shortDescription')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Short description cannot exceed 500 characters')
        .trim(),
    
    body('brand')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Brand cannot exceed 100 characters')
        .trim(),
    
    body('model')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Model cannot exceed 100 characters')
        .trim(),
    
    body('category')
        .optional()
        .isIn(['Легкові причепи', 'Вантажні причепи', 'Спеціальні причепи', 'Будівельні причепи', 'Причепи для човнів'])
        .withMessage('Invalid category'),
    
    body('price')
        .optional()
        .isNumeric()
        .withMessage('Price must be a number')
        .isFloat({ min: 0 })
        .withMessage('Price must be positive'),
    
    body('currency')
        .optional()
        .isIn(['UAH', 'USD', 'EUR'])
        .withMessage('Invalid currency'),
    
    body('quantity')
        .optional()
        .isNumeric()
        .withMessage('Quantity must be a number')
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
    
    body('images')
        .optional()
        .isArray()
        .withMessage('Images must be an array'),
    
    body('images.*')
        .optional()
        .isURL()
        .withMessage('Each image must be a valid URL'),
    
    body('specifications')
        .optional()
        .isArray()
        .withMessage('Specifications must be an array'),
    
    body('specifications.*.name')
        .optional()
        .notEmpty()
        .withMessage('Specification name is required'),
    
    body('specifications.*.value')
        .optional()
        .notEmpty()
        .withMessage('Specification value is required'),
    
    body('metaTitle')
        .optional()
        .isLength({ max: 160 })
        .withMessage('Meta title cannot exceed 160 characters')
        .trim(),
    
    body('metaDescription')
        .optional()
        .isLength({ max: 320 })
        .withMessage('Meta description cannot exceed 320 characters')
        .trim(),
    
    body('keywords')
        .optional()
        .isArray()
        .withMessage('Keywords must be an array'),
    
    body('isFeatured')
        .optional()
        .isBoolean()
        .withMessage('isFeatured must be a boolean'),
    
    body('inStock')
        .optional()
        .isBoolean()
        .withMessage('inStock must be a boolean')
];

module.exports = {
    validateTrailer,
    validateTrailerUpdate
};
