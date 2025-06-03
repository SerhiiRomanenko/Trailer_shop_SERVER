const express = require('express');
const router = express.Router();
const {
    getAllTrailers,
    getTrailerById,
    createTrailer,
    updateTrailer,
    deleteTrailer,
    getFeaturedTrailers,
    getCategories,
    getBrands,
    updateStock,
    searchTrailers
} = require('../controllers/trailerController');
const { validateTrailer, validateTrailerUpdate } = require('../middleware/validation');

// Routes for trailer operations

// GET /api/trailers - Get all trailers with filtering and pagination
router.get('/', getAllTrailers);

// GET /api/trailers/featured - Get featured trailers
router.get('/featured', getFeaturedTrailers);

// GET /api/trailers/categories - Get all categories
router.get('/categories', getCategories);

// GET /api/trailers/brands - Get all brands
router.get('/brands', getBrands);

// GET /api/trailers/search - Search trailers
router.get('/search', searchTrailers);

// GET /api/trailers/:id - Get single trailer by ID or slug
router.get('/:id', getTrailerById);

// POST /api/trailers - Create new trailer
router.post('/', validateTrailer, createTrailer);

// PUT /api/trailers/:id - Update trailer
router.put('/:id', validateTrailerUpdate, updateTrailer);

// PATCH /api/trailers/:id/stock - Update trailer stock
router.patch('/:id/stock', updateStock);

// DELETE /api/trailers/:id - Delete trailer
router.delete('/:id', deleteTrailer);

module.exports = router;
