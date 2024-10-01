// src/app/(dashboard)/dashboard/Tv/[tvName]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTvById } from '@/actions/GetTvById';
import { updateTvName } from '@/actions/tvActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Ensure you have an Input component
import { TV } from '@/constants/types';
import TVImage from '@/components/tvs/editPage/TVImage';
import TVStatus from '@/components/tvs/editPage/TVStatus';
import TVMusic from '@/components/tvs/editPage/TVMusic';
import TVDocuments from '@/components/tvs/editPage/TVDocuments';
import AddDocument from '@/components/tvs/editPage/AddDocument';
import TVTicker from '@/components/tvs/editPage/TVTicker';
import { useToast } from '@/components/ui/use-toast'; // Ensure you have a Toast component

const EditTvPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tvId = searchParams.get('id') as string;
  const [tvData, setTvData] = useState<TV | null>(null);
  const [editName, setEditName] = useState<string>('');
  const { toast } = useToast();

  const fetchTvData = async () => {
    const result = await getTvById(tvId);
    if (result.error) {
      console.error(result.error);
    } else if (result.resultData) { // Adding null check
      setTvData(result.resultData);
      setEditName(result.resultData.name);
    }
  };

  useEffect(() => {
    if (tvId) {
      fetchTvData();
    }
  }, [tvId]);

  if (!tvData) {
    return <div>Loading...</div>;
  }

  const handleDocumentDelete = () => {
    fetchTvData(); // Refresh data after deleting a document
  };

  const handleAddDocument = () => {
    fetchTvData(); // Refresh TV data including documents
  };

  const handleAddTicker = () => {
    fetchTvData(); // Refresh TV data including tickers
  };

  const handleNameChange = async () => {
   
    try {
      await updateTvName(tvId, editName);

      toast({
        title: 'Success',
        description: 'TV name updated successfully',
        className: 'bg-green-500 text-white', // Success toast styling
      });
      fetchTvData(); // Refresh TV data to get the updated name
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update TV name',
        className: 'bg-red-500 text-white', // Error toast styling
      });
      console.error(error);
    }
  };

  return (
    <div className="flex h-full">
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            <Input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-transparent border-none text-3xl font-bold p-0 m-0"
            />
          </h2>
          <Button variant="outline" className="ml-4" onClick={handleNameChange}>
            Save
          </Button>
        </header>
        <div className="flex flex-col space-y-8">
          <div className="flex items-center space-x-4">
            <TVImage displayedImage={tvData.displayedImage} tvName={tvData.name} />
            <div className="flex-1">
              <TVStatus isActive={tvData.isActive} />
              <TVDocuments documents={tvData.documents} onDocumentDelete={handleDocumentDelete} />
            </div>
          </div>
          <TVMusic tvId={tvId} music={tvData.music} onChange={fetchTvData} />
          <AddDocument tvId={tvId} onAdd={handleAddDocument} />
          <TVTicker
            tvId={tvId}
            ticker={tvData.ticker} // Correct property name
            onAdd={handleAddTicker}
          />
        </div>
      </main>
    </div>
  );
};

export default EditTvPage;

