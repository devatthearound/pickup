import CustomerServiceList from './CustomerServiceList';

interface PageProps {
  params: {
    storeId: string;
  };
}

export async function generateStaticParams() {
  return [];
}

export default function CustomerServicePage({ params }: PageProps) {
  return <CustomerServiceList storeId={params.storeId} />;
} 