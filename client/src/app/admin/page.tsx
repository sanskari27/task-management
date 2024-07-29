import PageLayout from '@/components/containers/page-layout';
import AdminNavbar from '@/components/elements/AdminNavbar';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function Admin() {
	return (
		<PageLayout>
			<BackgroundBeams />
			<AdminNavbar />
		</PageLayout>
	);
}
