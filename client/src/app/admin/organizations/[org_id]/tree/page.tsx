'use client';
import OrganizationService from '@/services/organization.service';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';

export default function EmployeesTree({ params: { org_id } }: { params: { org_id: string } }) {
	const [data, setData] = useState<any>(null);
	const targetRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const fetchData = async () => {
			const orgChart = await OrganizationService.employeeTree(org_id);
			setData(orgChart);
		};

		fetchData();
	}, [org_id]);

	useLayoutEffect(() => {
		if (targetRef.current) {
			setDimensions({
				width: targetRef.current.offsetWidth,
				height: targetRef.current.offsetHeight,
			});
		}
	}, []);

	return (
		<section className='mx-[2%] md:mx-[7%] mt-3'>
			<div className='flex md:justify-between'>
				<h2 className='text-3xl font-bold'>Organization Tree</h2>
			</div>
			<div id='treeWrapper' className='w-full h-[85vh] bg-white rounded-2xl' ref={targetRef}>
				{data && (
					<Tree
						data={data}
						orientation='vertical'
						pathFunc={'step'}
						translate={{ x: dimensions.width / 2, y: 100 }}
						separation={{ siblings: 3, nonSiblings: 3 }}
						zoom={0.75}
						nodeSize={{ x: 200, y: 170 }}
						transitionDuration={250}
						zoomable
						enableLegacyTransitions
					/>
				)}
			</div>
		</section>
	);
}
