const express = require('express');
const router = express.Router();
const trailerRoutes = require('./trailerRoutes');

// API Routes
router.use('/trailers', trailerRoutes);

// API Info endpoint
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Trailer Store API',
        version: '1.0.0',
        endpoints: {
            trailers: {
                'GET /api/trailers': 'Get all trailers with filtering and pagination',
                'GET /api/trailers/featured': 'Get featured trailers',
                'GET /api/trailers/categories': 'Get all categories with counts',
                'GET /api/trailers/brands': 'Get all brands with counts',
                'GET /api/trailers/search': 'Search trailers',
                'GET /api/trailers/:id': 'Get single trailer by ID or slug',
                'POST /api/trailers': 'Create new trailer',
                'PUT /api/trailers/:id': 'Update trailer',
                'PATCH /api/trailers/:id/stock': 'Update trailer stock',
                'DELETE /api/trailers/:id': 'Delete trailer'
            }
        },
        documentation: 'https://github.com/your-repo/trailer-store-api'
    });
});

module.exports = router;
