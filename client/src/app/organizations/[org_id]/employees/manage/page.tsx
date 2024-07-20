'use client';
import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import useManagedEmployees from '@/hooks/useManagedEmployees';
import { generateOrganizationTree } from '@/lib/utils';
import OrganizationService from '@/services/organization.service';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { toast } from 'react-hot-toast';

export default function ManageEmployees({ params: { org_id } }: { params: { org_id: string } }) {
	const targetRef = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const employees = useManagedEmployees(org_id);
	const [updates, setUpdates] = useState<
		{
			emp_id: string;
			parent_id: string;
		}[]
	>([]);

	const [emp_id, setEmpId] = useState<string>('');
	const [parent_id, setParentId] = useState<string>('');

	const employeeList = employees.map((employee) => ({
		label: employee.name,
		value: employee.id,
	}));

	const data = useMemo(() => {
		const new_data = [...employees];
		for (let i = 0; i < updates.length; i++) {
			const { emp_id, parent_id } = updates[i];
			const emp = new_data.find((e) => e.id === emp_id);
			if (emp) {
				emp.parent_id = parent_id;
			}
		}
		return generateOrganizationTree(new_data);
	}, [employees, updates]);

	function applyChanges() {
		if (emp_id && parent_id) {
			setUpdates((prev) => [...prev, { emp_id, parent_id }]);
			setEmpId('');
			setParentId('');
		} else {
			toast.error('Please select both employee and reporting person');
		}
	}

	async function saveChanges() {
		if (!updates.length) {
			toast.error('No changes to save');
			return;
		}
		setLoading(true);
		const success = await OrganizationService.reconfigureOrganizationTree(org_id, updates);
		setLoading(false);

		if (success) {
			toast.success('Organization tree updated successfully');
			router.push(`/organizations/${org_id}/employees`);
		} else {
			toast.error('Failed to update organization tree');
		}
	}

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
				<h2 className='text-3xl font-bold'>Manage Organization Tree</h2>
			</div>
			<div className='flex items-end my-4 gap-4'>
				<div className='grid gap-2 w-[400px]'>
					<Label htmlFor='email'>Select Employee</Label>
					<Combobox
						placeholder='Select employee...'
						items={employeeList}
						value={emp_id}
						onChange={(value) => setEmpId(value)}
					/>
				</div>
				<div className='grid gap-2 w-[400px]'>
					<Label htmlFor='email'>Updated Reporting Person</Label>
					<Combobox
						placeholder='Select reporting person...'
						items={employeeList}
						value={parent_id}
						onChange={(value) => setParentId(value)}
					/>
				</div>
				<div className='grid gap-2 w-[200px]'>
					<Button variant={'outline'} className='w-full' onClick={applyChanges}>
						Apply
					</Button>
				</div>
				<div className='grid gap-2 w-[200px] '>
					<Button
						onClick={saveChanges}
						className='w-full'
						disabled={loading || updates.length === 0}
					>
						{loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Save
					</Button>
				</div>
			</div>
			<div id='treeWrapper' className='w-full mt-6 h-[75vh] bg-white rounded-2xl' ref={targetRef}>
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
