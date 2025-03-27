import Link from 'next/link';

interface StoreCardProps {
  id: string;
  name: string;
  description: string;
  color: string;
}

const getContrastColor = (hexcolor: string) => {
  // Convert hex to RGB
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white depending on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export default function StoreCard({ id, name, description, color }: StoreCardProps) {
  const textColor = getContrastColor(color);
  
  return (
    <Link href={`/customer/store/${id}`}>
      <div 
        className="w-full aspect-square rounded-2xl p-6 transition-transform hover:scale-105"
        style={{ backgroundColor: color }}
      >
        <div className="h-full flex flex-col justify-between" style={{ color: textColor }}>
          <div className="text-2xl font-bold">{name}</div>
          <div className="text-sm opacity-80">{description}</div>
        </div>
      </div>
    </Link>
  );
} 