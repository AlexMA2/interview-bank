import { Product } from '@products/models/product.model';

function randomString(minLength: number, maxLength: number): string {
    const chars = 'ABCD EFG HIJ KL MN OP QRST UVWXY Zabcd efgh ijkl mnop qrstuv wxyz ';
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function randomDescription(minLength: number, maxLength: number): string {
    const chars = 'ABCD EFG HIJ KL MN OP QRST UVWXY Zabcd efgh ijkl mnop qrstuv wxyz ';
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function randomDate(after: string): string {
    const start = new Date(after).getTime();
    const end = start + 5 * 365 * 24 * 60 * 60 * 1000; // hasta 5 años después
    const date = new Date(start + Math.random() * (end - start));
    return date.toISOString().split('T')[0];
}

export function generateRandomProduct(): Product {
    const date_release = randomDate('2025-08-17');
    const year = parseInt(date_release.split('-')[0]) + 1;
    const date_revision = date_release.replace(/^\d{4}/, year.toString());

    // Generar una URL de imagen aleatoria de Lorem Picsum
    const imageWidth = 300;
    const imageHeight = 200;
    const imageUrl = `https://picsum.photos/${imageWidth}/${imageHeight}?random=${Math.floor(Math.random() * 1000)}`;

    return {
        id: randomString(3, 10),
        name: randomString(5, 12),
        description: randomDescription(20, 100),
        logo: imageUrl,
        date_release,
        date_revision
    };
}
