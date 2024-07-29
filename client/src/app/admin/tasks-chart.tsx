'use client';

import { getMonth } from '@/utils/date-utils';
import Chart from 'react-google-charts';

export default function TasksChart({
	tasks,
}: {
	tasks: {
		month: number;
		year: number;
		count: number;
	}[];
}) {
	const chartData = () => {
		if (tasks.length === 0) return [];
		const keys = ['MONTH', 'COUNT'];
		const data = tasks.map((c) => [`${getMonth(c.month)} ${c.year}`, c.count]);

		return [keys, ...data];
	};

	return (
		<>
			<div className='text-center text-black font-medium text-lg'>Tasks created per month</div>
			<Chart
				chartType='AreaChart'
				width='100%'
				height='400px'
				data={chartData()}
				options={{
					hAxis: { titleTextStyle: { color: '#333' } },
					vAxis: { minValue: 0 },
					chartArea: { width: '90%', height: '60%' },
					backgroundColor: 'transparent',
					legend: 'none',
				}}
			/>
		</>
	);
}
