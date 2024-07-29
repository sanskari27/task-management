'use client';

import { getFormattedDate, getMonth } from '@/utils/date-utils';
import Chart from 'react-google-charts';

export default function DailyTasksChart({
	tasks,
}: {
	tasks: {
		day: number;
		month: number;
		count: number;
	}[];
}) {
	const chartData = () => {
		if (tasks.length === 0) return [];
		const keys = ['DAY', 'COUNT'];
		const data = tasks.map((message) => {
			return [getFormattedDate(message.day), message.count];
		});

		return [keys, ...data];
	};
	const currentMonth = getMonth(new Date().getMonth() + 1, true);

	return (
		<>
			<div className='text-center text-black font-medium text-lg my-4'>
				Daily Tasks in {currentMonth}
			</div>
			<Chart
				chartType='AreaChart'
				width='100%'
				height='400px'
				data={chartData()}
				options={{
					hAxis: {
						titleTextStyle: { color: '#333' },
						minValue: 1,
						maxValue: 31,
					},
					vAxis: { minValue: 1 },
					chartArea: { width: '90%', height: '60%' },
					backgroundColor: 'transparent',
					legend: 'none',
				}}
			/>
		</>
	);
}
