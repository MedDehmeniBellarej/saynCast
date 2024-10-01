// src/components/tvs/editPage/TVDocuments.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { deleteDocument } from '@/actions/documentActions'; // Ensure you have a deleteDocument action

interface Document {
  id: string;
  displayName: string;
  order: number;
}

interface TVDocumentsProps {
  documents: Document[];
  onDocumentDelete: () => void; // Callback to update the document list
}

const TVDocuments: React.FC<TVDocumentsProps> = ({ documents, onDocumentDelete }) => {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      toast({
        title: "Success",
        description: "Document deleted successfully",
        className: "bg-green-500 text-white",
      });
      onDocumentDelete(); // Update the document list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4  rounded-md shadow-md">
      <ul className="mt-4">
        {documents.map((item, index) => (
          <li key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="flex-1 text-gray-900 dark:text-gray-100">{index + 1} {item.displayName}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500" 
              onClick={() => handleDelete(item.id)}
            >
              ❌
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TVDocuments;

