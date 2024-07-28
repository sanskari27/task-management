export default function taskCreate(details: { to: string; bodyParams: string[]; link: string }) {
	return {
		messaging_product: 'whatsapp',
		recipient_type: 'individual',
		to: details.to,
		type: 'template',
		template: {
			name: 'task_wautopilot_status_create',
			language: {
				code: 'en_US',
			},
			components: [
				{
					type: 'body',
					parameters: details.bodyParams.map((param) => ({
						type: 'TEXT',
						text: param,
					})),
				},
				{
					type: 'button',
					sub_type: 'URL',
					index: '0',
					parameters: [
						{
							type: 'TEXT',
							text: `/${details.link}`,
						},
					],
				},
			],
		},
	};
}
