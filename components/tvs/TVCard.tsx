import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TV {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
  music: string | null;
  ticker: string | null;
  documents: any[];
  displayedImage: string;
}

interface TVCardProps {
  tv: TV;
  onEdit: (tv: TV) => void;
  onShow: (tv: TV) => void;
}

const TVCard: React.FC<TVCardProps> = ({ tv, onEdit, onShow }) => {
  const imageUrl = `https://api.sayncast.dubai-app.com/${tv.displayedImage}`;

  return (
    <Card className="mx-auto w-xl max-w-sm md:max-w-md lg:max-w-3xl xl:max-w-5xl">
      
      <img src={imageUrl} alt={tv.name} className="w-full h-48 object-cover rounded-t-md" />
      <CardContent className="p-4">
        <div className="mb-2">
          <CardTitle className="text-lg font-semibold">{tv.name}</CardTitle>
          <div className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${tv.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <CardDescription>{tv.isActive ? 'active' : 'inactive'}</CardDescription>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="link" className="text-blue-500" onClick={() => onEdit(tv)}>
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default TVCard;

