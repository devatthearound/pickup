import React from 'react';
import Image from 'next/image';

interface StoreProfileImageProps {
  name: string;
  imageUrl?: string;
  size: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-16 h-16 text-lg',
  lg: 'w-24 h-24 text-xl',
};

const StoreProfileImage: React.FC<StoreProfileImageProps> = ({ name, imageUrl, size, onClick }) => {
  const initial = name ? name.charAt(0) : '?';
  const sizeClass = sizeClasses[size];

  if (!imageUrl) {
    return (
      <div className={`rounded-full overflow-hidden bg-[#FF7355] flex items-center justify-center ${sizeClass}`}>
        <span className="text-white font-bold">{initial}</span>
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClass} relative rounded-full overflow-hidden cursor-pointer`}
      onClick={onClick}
    >
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover"
      />
      {onClick && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-white text-sm">이미지 변경</span>
        </div>
      )}
    </div>
  );
};

export default StoreProfileImage; 