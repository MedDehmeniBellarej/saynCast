import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddTvModalProps {
  onAdd: (tv: { name: string; password: string }) => void;
}

const AddTvModal: React.FC<AddTvModalProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleAdd = () => {
    onAdd({ name, password });
    setName('');
    setPassword('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-blue-500 text-white p-2 rounded">Add New TV</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New TV</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            type="text"
            placeholder="TV Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} className="bg-blue-500 text-white">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTvModal;
