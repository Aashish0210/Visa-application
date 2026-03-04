/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Serve modern formats (avif / webp) automatically
        formats: ['image/avif', 'image/webp'],
        // Include 2K and 4K breakpoints for hero fullscreen images
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Aggressive caching – images rarely change
        minimumCacheTTL: 31536000, // 1 year
    },
    // Compress responses
    compress: true,
    // Remove the X-Powered-By header (minor security + bytes)
    poweredByHeader: false,
};

module.exports = nextConfig;
