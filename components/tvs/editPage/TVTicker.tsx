// src/components/tvs/editPage/TVTicker.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { addTicker, deleteTicker } from '@/actions/tickerActions';

interface Ticker {
  id: string;
  description: string;
  type: number;
}

interface TVTickerProps {
  tvId: string;
  ticker: Ticker | null;
  onAdd: () => void;
}

const TVTicker: React.FC<TVTickerProps> = ({ tvId, ticker, onAdd }) => {
  const { toast } = useToast();
  const [newTicker, setNewTicker] = useState<string>('');
  const [tickerType, setTickerType] = useState<string>('Alert');

  useEffect(() => {
    if (ticker) {
      setNewTicker(ticker.description);
      setTickerType(ticker.type === 0 ? 'Alert' : 'News');
    }
  }, [ticker]);

  const handleAddTicker = async () => {
    const tickerData = {
      description: newTicker,
      type: tickerType === 'Alert' ? 0 : 1,
      ispublished: true,
      tvIds: [tvId],
    };

    try {
      await addTicker(tickerData);
      toast({
        title: "Success",
        description: "Ticker added successfully",
        className: "bg-green-500 text-white", // Success toast styling
      });
      setNewTicker('');
      setTickerType('Alert');
      onAdd();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add ticker",
        className: "bg-red-500 text-white", // Error toast styling
      });
    }
  };

  const handleDeleteTicker = async (tickerId: string) => {
    try {
      await deleteTicker(tickerId);
      toast({
        title: "Success",
        description: "Ticker deleted successfully",
        className: "bg-green-500 text-white", // Success toast styling
      });
      setNewTicker('');
      setTickerType('Alert');
      onAdd();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ticker",
        className: "bg-red-500 text-white", // Error toast styling
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">New Ticker</h3>
      <Textarea 
        value={newTicker} 
        onChange={e => setNewTicker(e.target.value)} 
        className="mb-4 dark:bg-gray-700 dark:text-gray-100" 
      />
      <div className="flex items-center space-x-4 mb-4">
        {['Alert', 'News'].map(type => (
          <label key={type} className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
            <input
              type="radio"
              name="tickerType"
              value={type}
              checked={tickerType === type}
              onChange={() => setTickerType(type)}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between">
        <Button className="bg-blue-500 text-white mb-4" onClick={handleAddTicker}>Submit</Button>
        {ticker && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-500 mb-4" 
            onClick={() => handleDeleteTicker(ticker.id)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default TVTicker;

