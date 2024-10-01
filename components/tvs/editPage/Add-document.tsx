// src/components/tvs/editPage/AddDocument.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress'; 
import { useToast } from '@/components/ui/use-toast';
import { Upload, Loader } from 'lucide-react'; 
import { uploadDocumentMedias, addDocument } from '@/actions/documentActions';

const mediaTypes = ['Album', 'Image', 'Video', 'PDF', 'Excel/PowerPoint'];

interface AddDocumentProps {
  tvId: string;
  onAdd: () => void;
}

const AddDocument: React.FC<AddDocumentProps> = ({ tvId, onAdd }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [radioItem, setRadioItem] = useState<string>('Album');
  const [recurrentTime, setRecurrentTime] = useState<string>('00:00');
  const [displayTime, setDisplayTime] = useState<string>('00:00');
  const [uploadedFilePaths, setUploadedFilePaths] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      setIsUploading(true);
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append('files', file));

      try {
        const uploadResult: string[] = await uploadDocumentMedias(formData, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        });

        if (Array.isArray(uploadResult) && uploadResult.length > 0) {
          setUploadedFilePaths(uploadResult);
          toast({
            title: "Success",
            description: "Files uploaded successfully",
            className: "bg-green-500 text-white", // Success toast styling
          });
        } else {
          throw new Error("No file paths returned from upload");
        }

        setSelectedFiles([]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload files",
          className: "bg-red-500 text-white", // Error toast styling
        });
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleSubmit = async () => {
    if (uploadedFilePaths.length === 0) {
      toast({
        title: "Error",
        description: "No files uploaded. Please upload files first.",
        className: "bg-red-500 text-white", // Error toast styling
      });
      return;
    }

    const documentData = {
      tvId: [tvId],
      displayOrder: 0,
      startTime: "00:00",
      displayTime: displayTime,
      recurent: radioItem === 'Album' ? recurrentTime : "00:00", // Ensuring recurent is always a string
      startAnimation: 0,
      endAnimation: 0,
      type: mediaTypes.indexOf(radioItem),
      medias: uploadedFilePaths, // Use the uploaded file paths
    };

    try {
      await addDocument(documentData);
      toast({
        title: "Success",
        description: "Document added successfully",
        className: "bg-green-500 text-white", // Success toast styling
      });

      // Reset form fields after successful submission
      setUploadedFilePaths([]);
      setRecurrentTime('00:00');
      setDisplayTime('00:00');
      setRadioItem('Album');
      onAdd(); // Trigger parent update
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add document",
        className: "bg-red-500 text-white", // Error toast styling
      });
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const value = event.target.value;
    const [minutes, seconds] = value.split(':');
    if (parseInt(minutes) >= 0 && parseInt(minutes) < 60 && parseInt(seconds) >= 0 && parseInt(seconds) < 60) {
      setter(value);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Add Media / Document</h3>
      <RadioGroup defaultValue={radioItem} onValueChange={setRadioItem} className="flex space-x-4 mb-6">
        {mediaTypes.map(type => (
          <div key={type} className="flex items-center space-x-2">
            <RadioGroupItem value={type} id={type} />
            <Label htmlFor={type} className="text-gray-900 dark:text-gray-100">{type}</Label>
          </div>
        ))}
      </RadioGroup>
      <div className="flex items-center space-x-4 mb-6">
        <Input 
          type="file" 
          onChange={handleFileChange} 
          multiple={radioItem === 'Album'}
          accept={
            radioItem === 'Album' ? 'image/*' :
            radioItem === 'Image' ? 'image/*' :
            radioItem === 'Video' ? 'video/*' :
            radioItem === 'PDF' ? 'application/pdf' :
            radioItem === 'Excel/PowerPoint' ? 'application/vnd.ms-excel, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
            ''
          }
          className="flex-grow dark:bg-gray-700 dark:text-gray-100 p-2 rounded"
        />
        <Button
  onClick={handleUpload}
  className={`flex items-center space-x-1 p-2 rounded bg-white dark:bg-gray-700 dark:text-green-500 text-green-500`}
  disabled={isUploading}
>
  {isUploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
  <span>Upload</span>
</Button>

      </div>
      {isUploading && <Progress value={uploadProgress} className="mb-6" />}
      {radioItem === 'Album' && (
        <div className="flex items-center space-x-4 mb-6">
          <Label htmlFor="recurrentTime" className="text-gray-900 dark:text-gray-100">Recurrent</Label>
          <Input
            type="text"
            id="recurrentTime"
            value={recurrentTime}
            onChange={(e) => handleTimeChange(e, setRecurrentTime)}
            placeholder="MM:SS"
            className="dark:bg-gray-700 dark:text-gray-100 p-2 rounded"
          />
        </div>
      )}
      <div className="flex items-center space-x-4 mb-6">
        <Label htmlFor="displayTime" className="text-gray-900 dark:text-gray-100">Display Time</Label>
        <Input
          type="text"
          id="displayTime"
          value={displayTime}
          onChange={(e) => handleTimeChange(e, setDisplayTime)}
          placeholder="MM:SS"
          className="dark:bg-gray-700 dark:text-gray-100 p-2 rounded"
        />
      </div>
      <div className="mb-6">
        <Label className="block mb-2 text-gray-900 dark:text-gray-100">Animation Change</Label>
        <div className="flex space-x-4">
          <Button variant="outline" className="dark:text-gray-100">
            <img src="/icons/fast-forward1.svg" alt="Animation 1" className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="dark:text-gray-100">
            <img src="/icons/fast-forward2.svg" alt="Animation 2" className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="dark:text-gray-100">
            <img src="/icons/fast-forward3.svg" alt="Animation 3" className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="dark:text-gray-100">
            <img src="/icons/fast-forward4.svg" alt="Animation 4" className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="dark:text-gray-100">
            <img src="/icons/blur1.svg" alt="Animation 5" className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="dark:text-gray-100">
            <img src="/icons/blur2.svg" alt="Animation 6" className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          onClick={handleSubmit}
          className={`bg-blue-500 text-white flex items-center space-x-2 p-2 rounded ${uploadedFilePaths.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isUploading || uploadedFilePaths.length === 0}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddDocument;
