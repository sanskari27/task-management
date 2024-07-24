/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			'api.microlink.io', // Microlink Image Preview
		],
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8567',
				pathname: '/media/**',
			},
			{
				protocol: 'https',
				hostname: 'task-api.wautopilot.com',
				port: '',
				pathname: '/media/**',
			},
			{
				protocol: 'https',
				hostname: 'assets.aceternity.com',
				port: '',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
