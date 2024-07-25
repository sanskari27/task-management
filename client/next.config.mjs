/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
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
			{
				protocol: 'https',
				hostname: 'api.microlink.io',
				port: '',
				pathname: '/**',
			}
		],
	},
};

export default nextConfig;
