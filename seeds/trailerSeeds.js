const mongoose = require('mongoose');
const Trailer = require('../models/Trailer');
const { createSlug } = require('../utils/slugify');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Sample trailer data for seeding
const trailerData = [
    {
        name: "Причіп легковий Кремень ПЛ-2",
        description: "<p>Надійний легковий причіп для транспортування різноманітних вантажів. Оснащений ресорною підвіскою та посиленою рамою.</p>",
        shortDescription: "Легковий причіп з ресорною підвіскою.",
        brand: "Кремень",
        model: "ПЛ-2",
        category: "Легкові причепи",
        price: 35000,
        currency: "UAH",
        inStock: true,
        quantity: 5,
        images: [
            "https://example.com/images/kremen-pl2-main.jpg",
            "https://example.com/images/kremen-pl2-side.jpg",
            "https://example.com/images/kremen-pl2-interior.jpg"
        ],
        specifications: [
            { name: "Вантажопідйомність", value: "750", unit: "кг" },
            { name: "Довжина кузова", value: "2000", unit: "мм" },
            { name: "Ширина кузова", value: "1200", unit: "мм" },
            { name: "Висота борту", value: "400", unit: "мм" },
            { name: "Тип підвіски", value: "Ресорна" },
            { name: "Колісна формула", value: "1R" }
        ],
        metaTitle: "Купити легковий причіп Кремень ПЛ-2 в Україні",
        metaDescription: "Детальний опис та характеристики причепа Кремень ПЛ-2. Доставка по Україні.",
        keywords: ["причіп", "легковий причіп", "Кремень", "ПЛ-2", "купити причіп"],
        isFeatured: true
    },
    {
        name: "Причіп вантажний БУС-3500",
        description: "<p>Міцний вантажний причіп для перевезення важких вантажів. Має підсилену раму та надійну гальмівну систему.</p>",
        shortDescription: "Вантажний причіп підвищеної вантажопідйомності.",
        brand: "БУС",
        model: "3500",
        category: "Вантажні причепи",
        price: 85000,
        currency: "UAH",
        inStock: true,
        quantity: 3,
        images: [
            "https://example.com/images/bus-3500-main.jpg",
            "https://example.com/images/bus-3500-side.jpg"
        ],
        specifications: [
            { name: "Вантажопідйомність", value: "3500", unit: "кг" },
            { name: "Довжина кузова", value: "4000", unit: "мм" },
            { name: "Ширина кузова", value: "2000", unit: "мм" },
            { name: "Висота борту", value: "600", unit: "мм" },
            { name: "Тип підвіски", value: "Ресорна з амортизаторами" },
            { name: "Колісна формула", value: "2R" }
        ],
        metaTitle: "Вантажний причіп БУС-3500 - купити в Україні",
        metaDescription: "Надійний вантажний причіп БУС-3500 з вантажопідйомністю 3,5 тонни.",
        keywords: ["вантажний причіп", "БУС", "3500 кг", "причіп для вантажів"],
        isFeatured: true
    },
    {
        name: "Причіп для човнів АкваТранс М-500",
        description: "<p>Спеціалізований причіп для транспортування човнів та водного транспорту. Має регульовані ролики та надійну систему кріплення.</p>",
        shortDescription: "Причіп для транспортування човнів.",
        brand: "АкваТранс",
        model: "М-500",
        category: "Причепи для човнів",
        price: 28000,
        currency: "UAH",
        inStock: true,
        quantity: 8,
        images: [
            "https://example.com/images/aquatrans-m500-main.jpg"
        ],
        specifications: [
            { name: "Максимальна довжина човна", value: "5000", unit: "мм" },
            { name: "Максимальна вага човна", value: "500", unit: "кг" },
            { name: "Ширина платформи", value: "1800", unit: "мм" },
            { name: "Тип роликів", value: "Регульовані" },
            { name: "Матеріал рами", value: "Оцинкована сталь" }
        ],
        metaTitle: "Причіп для човнів АкваТранс М-500",
        metaDescription: "Спеціалізований причіп для човнів з регульованими роликами.",
        keywords: ["причіп для човнів", "АкваТранс", "транспорт човнів", "водний транспорт"],
        isFeatured: false
    }
];

// Connect to database and seed data
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trailer_store';
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('📡 Connected to MongoDB for seeding...');

        // Clear existing data
        await Trailer.deleteMany({});
        console.log('🗑️  Cleared existing trailer data');

        // Generate slugs for each trailer
        const trailersWithSlugs = trailerData.map(trailer => ({
            ...trailer,
            slug: createSlug(trailer.name)
        }));

        // Insert new data
        const trailers = await Trailer.insertMany(trailersWithSlugs);
        console.log(`✅ Successfully seeded ${trailers.length} trailers`);

        // Display seeded trailers
        trailers.forEach((trailer, index) => {
            console.log(`${index + 1}. ${trailer.name} (${trailer.slug})`);
        });

        console.log('\n🎉 Database seeding completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    console.log('🌱 Starting database seeding...');
    seedDatabase();
}

module.exports = {
    seedDatabase,
    trailerData
};
