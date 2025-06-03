/**
 * Create URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} - URL-friendly slug
 */
const createSlug = (text) => {
    if (!text || typeof text !== 'string') {
        return '';
    }

    // Ukrainian to Latin transliteration map
    const ukrainianToLatin = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e',
        'є': 'ie', 'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'i', 'й': 'i',
        'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'iu', 'я': 'ia',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'H', 'Ґ': 'G', 'Д': 'D', 'Е': 'E',
        'Є': 'Ie', 'Ж': 'Zh', 'З': 'Z', 'И': 'Y', 'І': 'I', 'Ї': 'I', 'Й': 'I',
        'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
        'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch',
        'Ш': 'Sh', 'Щ': 'Shch', 'Ь': '', 'Ю': 'Iu', 'Я': 'Ia'
    };

    return text
        .trim()
        .toLowerCase()
        // Replace Ukrainian characters with Latin equivalents
        .split('')
        .map(char => ukrainianToLatin[char] || char)
        .join('')
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Replace non-alphanumeric characters with hyphens
        .replace(/[^a-z0-9\-]/g, '-')
        // Remove multiple consecutive hyphens
        .replace(/-+/g, '-')
        // Remove leading and trailing hyphens
        .replace(/^-+|-+$/g, '')
        // Limit length
        .substring(0, 100);
};

/**
 * Generate unique slug by checking database
 * @param {string} text - Text to convert to slug
 * @param {Object} Model - Mongoose model to check against
 * @param {string} excludeId - ID to exclude from uniqueness check (for updates)
 * @returns {Promise<string>} - Unique slug
 */
const generateUniqueSlug = async (text, Model, excludeId = null) => {
    let baseSlug = createSlug(text);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const query = { slug };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existingDocument = await Model.findOne(query);
        if (!existingDocument) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
    }
};

module.exports = {
    createSlug,
    generateUniqueSlug
};
