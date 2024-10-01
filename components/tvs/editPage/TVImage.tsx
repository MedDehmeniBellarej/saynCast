// src/components/tvs/editPage/TVImage.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface TVImageProps {
  displayedImage: string;
  tvName: string;
}

const TVImage: React.FC<TVImageProps> = ({ displayedImage, tvName }) => {
  return (
    <div className="relative w-1/3 h-full rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800">
      <img src={`https://api.sayncast.dubai-app.com/${displayedImage}`} alt={tvName} className="w-full h-full object-cover" />
     
    </div>
  );
};

export default TVImage;
