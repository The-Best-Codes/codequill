/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        turbo: {
            useSwcCss: true,
            treeShaking: true,
        }
    }
};

export default nextConfig;
