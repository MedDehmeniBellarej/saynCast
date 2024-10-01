// src/components/tvs/editPage/TVMusic.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Upload, Loader } from 'lucide-react';
import { uploadMusic, playMusic, pauseMusic } from '@/actions/musicActions';
import { useToast } from '@/components/ui/use-toast';

interface Music {
  id: string;
  filePath: string;
  musicName: string;
  isPlayed: boolean;
}

interface TVMusicProps {
  tvId: string;
  music: Music;
  onChange: () => void;
}

const TVMusic: React.FC<TVMusicProps> = ({ tvId, music, onChange }) => {
  const [isPlaying, setIsPlaying] = useState(music.isPlayed);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await pauseMusic(music.id);
        toast({
          title: "Music Paused",
          description: `${music.musicName} has been paused.`,
          className: "bg-blue-500 text-white",
          duration: 2000, // 2 seconds

        });
      } else {
        await playMusic(music.id);
        toast({
          title: "Music Playing",
          description: `${music.musicName} is now playing.`,
          className: "bg-green-500 text-white",
          duration: 2000, // 2 seconds
        });
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isPlaying ? 'pause' : 'play'} music.`,
        className: "bg-red-500 text-white",
        duration: 2000, // 2 seconds

      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        console.log(`Uploading music for tvId: ${tvId}`); // Debugging log
        console.log(`Selected file: ${selectedFile.name}`); // Debugging log
        await uploadMusic(tvId, selectedFile);
        toast({
          title: "Success",
          description: "Music uploaded successfully.",
          className: "bg-green-500 text-white",
          duration: 2000, // 2 seconds

        });
        onChange();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload music.",
          className: "bg-red-500 text-white",
          duration: 2000, // 2 seconds

        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Music Player</h3>
      <ul className="space-y-2">
        <li className="flex items-center justify-between py-2 border-b border-gray-400 dark:border-gray-700">
          <span className="text-gray-900 dark:text-gray-100">{music.musicName}</span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePlayPause} className="text-blue-500">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </li>
      </ul>
      <div className="mt-4">
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer dark:text-gray-400 dark:border-gray-600 dark:placeholder-gray-400" 
        />
        <Button 
          onClick={handleUpload} 
          className="flex items-center space-x-1 p-2 rounded bg-white dark:bg-gray-600 text-green-500 dark:text-green-500 mt-2" 
          disabled={isUploading}
        >
          {isUploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>Upload</span>
        </Button>
      </div>
    </div>
  );
};

export default TVMusic;
