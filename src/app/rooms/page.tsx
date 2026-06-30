import type { Metadata } from 'next';
import RoomsPage from '@/components/RoomsPage';

export const metadata: Metadata = {
  title: 'Shop the Room | Hunarkar',
  description: 'Explore every piece in our curated Pakistani artisan room — hand-crafted furniture, lighting, rugs and décor.',
};

export default function Page() {
  return <RoomsPage />;
}
