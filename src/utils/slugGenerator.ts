import type { Model, Document } from 'mongoose';

/**
 * Generates a unique slug for a given model.
 * @param Model The Mongoose model to check against.
 * @param title The title or string to base the slug on.
 * @param oldSlug Optional. If provided (e.g., during update), ensures we don't count the current doc's slug as a duplicate of itself.
 * @returns A unique slug string.
 */
export const generateUniqueSlug = async (
    Model: Model<any>,
    title: string,
    oldSlug?: string
): Promise<string> => {
    // 1. Generate base slug
    let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/(^-|-$)+/g, '');   // Remove leading/trailing hyphens

    // If slug became empty (e.g. title was "###"), default to something
    if (!slug) {
        slug = 'product-' + Date.now();
    }

    // 2. Check for existence
    // If we are updating and the slug hasn't changed (or matches oldSlug), return it?
    // Actually, usually we only call this if title changed or on create.

    // We'll create a regex to find matching slugs: ^slug(-[0-9]*)?$
    // This matches "slug", "slug-1", "slug-2", etc.
    const slugRegex = new RegExp(`^${slug}(-[0-9]*)?$`, 'i');

    const docs = await Model.find({ slug: slugRegex });

    if (docs.length === 0) {
        return slug;
    }

    // Filter out the current document if oldSlug is provided
    const existingSlugs = docs
        .filter(doc => doc.slug !== oldSlug)
        .map(doc => doc.slug);

    if (existingSlugs.length === 0) {
        return slug;
    }

    if (!existingSlugs.includes(slug)) {
        return slug;
    }

    // 3. Find the highest counter
    let counter = 1;
    while (existingSlugs.includes(`${slug}-${counter}`)) {
        counter++;
    }

    return `${slug}-${counter}`;
};
