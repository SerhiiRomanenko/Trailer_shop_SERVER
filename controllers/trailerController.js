const Trailer = require('../models/Trailer');
const { createSlug } = require('../utils/slugify');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');

// Get all trailers with filtering, pagination, and search
const getAllTrailers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            brand,
            minPrice,
            maxPrice,
            inStock,
            isFeatured,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = {};

        if (category) filter.category = category;
        if (brand) filter.brand = new RegExp(brand, 'i');
        if (inStock !== undefined) filter.inStock = inStock === 'true';
        if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
        
        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Search functionality
        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { brand: new RegExp(search, 'i') },
                { model: new RegExp(search, 'i') },
                { category: new RegExp(search, 'i') },
                { keywords: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Sort options
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Execute query
        const trailers = await Trailer.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const total = await Trailer.countDocuments(filter);
        const totalPages = Math.ceil(total / Number(limit));

        const pagination = {
            currentPage: Number(page),
            totalPages,
            totalItems: total,
            itemsPerPage: Number(limit),
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1
        };

        successResponse(res, {
            trailers,
            pagination
        }, 'Trailers retrieved successfully');

    } catch (error) {
        console.error('Error in getAllTrailers:', error);
        errorResponse(res, 'Failed to retrieve trailers', 500);
    }
};

// Get single trailer by ID or slug
const getTrailerById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Try to find by ID first, then by slug
        let trailer = await Trailer.findById(id);
        if (!trailer) {
            trailer = await Trailer.findOne({ slug: id });
        }

        if (!trailer) {
            return errorResponse(res, 'Trailer not found', 404);
        }

        successResponse(res, trailer, 'Trailer retrieved successfully');

    } catch (error) {
        console.error('Error in getTrailerById:', error);
        errorResponse(res, 'Failed to retrieve trailer', 500);
    }
};

// Create new trailer
const createTrailer = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }

        const trailerData = req.body;

        // Generate slug if not provided
        if (!trailerData.slug) {
            trailerData.slug = createSlug(trailerData.name);
        } else {
            trailerData.slug = createSlug(trailerData.slug);
        }

        // Check if slug already exists
        const existingTrailer = await Trailer.findOne({ slug: trailerData.slug });
        if (existingTrailer) {
            // Add timestamp to make slug unique
            trailerData.slug = `${trailerData.slug}-${Date.now()}`;
        }

        const trailer = new Trailer(trailerData);
        await trailer.save();

        successResponse(res, trailer, 'Trailer created successfully', 201);

    } catch (error) {
        console.error('Error in createTrailer:', error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            return errorResponse(res, 'Validation failed', 400, validationErrors);
        }
        errorResponse(res, 'Failed to create trailer', 500);
    }
};

// Update trailer
const updateTrailer = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }

        // If name is being updated, regenerate slug
        if (updates.name && !updates.slug) {
            updates.slug = createSlug(updates.name);
        } else if (updates.slug) {
            updates.slug = createSlug(updates.slug);
        }

        const trailer = await Trailer.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!trailer) {
            return errorResponse(res, 'Trailer not found', 404);
        }

        successResponse(res, trailer, 'Trailer updated successfully');

    } catch (error) {
        console.error('Error in updateTrailer:', error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            return errorResponse(res, 'Validation failed', 400, validationErrors);
        }
        errorResponse(res, 'Failed to update trailer', 500);
    }
};

// Delete trailer
const deleteTrailer = async (req, res) => {
    try {
        const { id } = req.params;

        const trailer = await Trailer.findByIdAndDelete(id);

        if (!trailer) {
            return errorResponse(res, 'Trailer not found', 404);
        }

        successResponse(res, null, 'Trailer deleted successfully');

    } catch (error) {
        console.error('Error in deleteTrailer:', error);
        errorResponse(res, 'Failed to delete trailer', 500);
    }
};

// Get featured trailers
const getFeaturedTrailers = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const trailers = await Trailer.getFeatured(Number(limit));

        successResponse(res, trailers, 'Featured trailers retrieved successfully');

    } catch (error) {
        console.error('Error in getFeaturedTrailers:', error);
        errorResponse(res, 'Failed to retrieve featured trailers', 500);
    }
};

// Get categories
const getCategories = async (req, res) => {
    try {
        const categories = Trailer.getCategories();
        
        // Get count for each category
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                const count = await Trailer.countDocuments({ category, inStock: true });
                return { name: category, count };
            })
        );

        successResponse(res, categoriesWithCounts, 'Categories retrieved successfully');

    } catch (error) {
        console.error('Error in getCategories:', error);
        errorResponse(res, 'Failed to retrieve categories', 500);
    }
};

// Get brands
const getBrands = async (req, res) => {
    try {
        const brands = await Trailer.distinct('brand');
        
        // Get count for each brand
        const brandsWithCounts = await Promise.all(
            brands.map(async (brand) => {
                const count = await Trailer.countDocuments({ brand, inStock: true });
                return { name: brand, count };
            })
        );

        successResponse(res, brandsWithCounts, 'Brands retrieved successfully');

    } catch (error) {
        console.error('Error in getBrands:', error);
        errorResponse(res, 'Failed to retrieve brands', 500);
    }
};

// Update stock
const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || quantity < 0) {
            return errorResponse(res, 'Valid quantity is required', 400);
        }

        const trailer = await Trailer.findById(id);
        if (!trailer) {
            return errorResponse(res, 'Trailer not found', 404);
        }

        await trailer.updateStock(Number(quantity));

        successResponse(res, trailer, 'Stock updated successfully');

    } catch (error) {
        console.error('Error in updateStock:', error);
        errorResponse(res, 'Failed to update stock', 500);
    }
};

// Search trailers
const searchTrailers = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;

        if (!q || q.trim().length === 0) {
            return errorResponse(res, 'Search query is required', 400);
        }

        const searchQuery = q.trim();
        
        const trailers = await Trailer.find({
            $or: [
                { name: new RegExp(searchQuery, 'i') },
                { brand: new RegExp(searchQuery, 'i') },
                { model: new RegExp(searchQuery, 'i') },
                { category: new RegExp(searchQuery, 'i') },
                { keywords: { $in: [new RegExp(searchQuery, 'i')] } }
            ]
        }).limit(Number(limit));

        successResponse(res, trailers, 'Search completed successfully');

    } catch (error) {
        console.error('Error in searchTrailers:', error);
        errorResponse(res, 'Search failed', 500);
    }
};

module.exports = {
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
};
