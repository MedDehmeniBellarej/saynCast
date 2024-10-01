"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Loader } from 'lucide-react';
import { uploadAndAddDocument } from '@/actions/documentActions';
import { TimePicker } from '@/components/ui/date-time-picker/time-picker';
import { TimeValue } from 'react-aria';

const mediaTypes = ['Album', 'Image', 'Video', 'PDF', 'Excel/PowerPoint'];
const animations = [
  { id: 0, name: 'Animation 1', icon: '/icons/fast-forward1.svg' },
  { id: 1, name: 'Animation 2', icon: '/icons/fast-forward2.svg' },
  { id: 2, name: 'Animation 3', icon: '/icons/fast-forward3.svg' },
  { id: 3, name: 'Animation 4', icon: '/icons/fast-forward4.svg' },
  { id: 4, name: 'Animation 5', icon: '/icons/blur1.svg' },
  { id: 5, name: 'Animation 6', icon: '/icons/blur2.svg' },
];

interface AddDocumentProps {
  tvId: string;
  onAdd: () => void;
}

const AddDocument: React.FC<AddDocumentProps> = ({ tvId, onAdd }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [radioItem, setRadioItem] = useState<string>('Album');
  const [recurrentTime, setRecurrentTime] = useState<TimeValue | null>(null);
  const [displayTime, setDisplayTime] = useState<TimeValue | null>(null);
  const [startAnimation, setStartAnimation] = useState<number>(0); // Default animation
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debugging hooks to log state changes
  useEffect(() => {
    console.log("Recurrent Time:", recurrentTime);
  }, [recurrentTime]);

  useEffect(() => {
    console.log("Display Time:", displayTime);
  }, [displayTime]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
    }
  };

  const formatTime = (time: TimeValue | null): string => {
    if (!time) return "00:00";
    const hours = time.hours < 10 ? `0${time.hours}` : time.hours;
    const minutes = time.minutes < 10 ? `0${time.minutes}` : time.minutes;
    return `${hours}:${minutes}`;
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "No files selected. Please select files to upload.",
        className: "bg-red-500 text-white", // Error toast styling
      });
      return;
    }

    if (!displayTime) {
      toast({
        title: "Error",
        description: "Please set the display time.",
        className: "bg-red-500 text-white", // Error toast styling
      });
      return;
    }

    setIsUploading(true);

    const documentData = {
      TvId: [tvId],
      DisplayOrder: 0,
      StartTime: "00:00",
      DisplayTime: "00:01:00",
      Recurent: "00:00:31",
      StartAnimation: startAnimation,
      EndAnimation: 0, // Placeholder for end animation if required
      Type: mediaTypes.indexOf(radioItem)
    };

    console.log("Formatted Document Data:", documentData); // Log the formatted data

    try {
      await uploadAndAddDocument(selectedFiles, documentData, (progress) => {
        setUploadProgress(progress);
      });

      toast({
        title: "Success",
        description: "Document and files uploaded successfully",
        className: "bg-green-500 text-white", // Success toast styling
      });
      onAdd(); // Trigger parent update

      // Reset form fields after successful submission
      setSelectedFiles([]);
      setRecurrentTime(null);
      setDisplayTime(null);
      setRadioItem('Album');
      setUploadProgress(0);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document and files",
        className: "bg-red-500 text-white", // Error toast styling
      });
    } finally {
      setIsUploading(false);
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
          ref={fileInputRef}
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
      </div>
      {radioItem === 'Album' && (
        <div className="flex items-center space-x-4 mb-6">
          <Label htmlFor="recurrentTime" className="text-gray-900 dark:text-gray-100">Recurrent</Label>
          <TimePicker
            onChange={setRecurrentTime}
            value={recurrentTime}
            className="dark:bg-gray-700 dark:text-gray-100 p-2 rounded"
          />
        </div>
      )}
      <div className="flex items-center space-x-4 mb-6">
        <Label htmlFor="displayTime" className="text-gray-900 dark:text-gray-100">Display Time</Label>
        <TimePicker
          onChange={setDisplayTime}
          value={displayTime}
          className="dark:bg-gray-700 dark:text-gray-100 p-2 rounded"
        />
      </div>
      <div className="mb-6">
        <Label className="block mb-2 text-gray-900 dark:text-gray-100">Start Animation</Label>
        <div className="flex space-x-4">
          {animations.map(animation => (
            <Button 
              key={animation.id} 
              variant="outline" 
              className={`dark:text-gray-100 ${startAnimation === animation.id ? 'bg-blue-500' : ''}`}
              onClick={() => setStartAnimation(animation.id)}
            >
              <img src={animation.icon} alt={animation.name} className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className={`bg-blue-500 text-white flex items-center space-x-2 p-2 rounded ${selectedFiles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isUploading || selectedFiles.length === 0}
          >
            {isUploading ? <Loader className="w-4 h-4 animate-spin" /> : <span>Submit</span>}
          </Button>
        </div>
        {isUploading && <Progress value={uploadProgress} />}
      </div>
    </div>
  );
};

export default AddDocument;
