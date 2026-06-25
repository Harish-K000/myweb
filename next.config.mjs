/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true, // For easier deployment to static hosts like Netlify/Vercel if needed
    },
};

export default nextConfig;
