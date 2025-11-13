import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X, Tag, AlertCircle, Paperclip } from 'lucide-react';
import '../../../css/pages/issues.css'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FileUploader from '@/components/ui/Fileuploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Types
interface IssueFormData {
  name: string;
  description?: string;
  type: string;
  priority: string;
  assigneeId?: string;
  dueDate?: string;
  estimate?: number;
  attachments?: FileList | null;
  labels?: string[];
  parentId?: string;
  reporterId: string;
}

interface CreateIssueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IssueFormData) => void;
}

// Mock Data
const issueTypes = [
  { value: 'story', label: 'Story', icon: '📖' },
  { value: 'task', label: 'Task', icon: '✓' },
  { value: 'epic', label: 'Epic', icon: '⚡' },
  { value: 'subtask', label: 'Subtask', icon: '🔹' },
];

const priorities = [
  { value: 'highest', label: 'Highest', color: 'text-red-600' },
  { value: 'high', label: 'High', color: 'text-orange-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'low', label: 'Low', color: 'text-blue-600' },
  { value: 'lowest', label: 'Lowest', color: 'text-gray-600' },
];

const users = [
  { id: '1', name: 'Sarah Johnson' },
  { id: '2', name: 'Mike Chen' },
  { id: '3', name: 'Alex Rivera' },
  { id: '4', name: 'Emma Davis' },
];

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } =
    useForm<IssueFormData>({
      defaultValues: {
        name: '',
        description: '',
        type: '',
        priority: 'medium',
        assigneeId: '',
        dueDate: '',
        estimate: undefined,
        attachments: null,
        labels: [],
        parentId: '',
      },
    });

  const handleFormSubmit = async (data: IssueFormData) => {
    const formattedData = {
      ...data,
      labels: selectedLabels,
    };
    console.log(data)
    await onSubmit(formattedData);
    reset();
    setSelectedLabels([]);
    onClose();
  };

  const handleClose = () => {
    reset();
    setSelectedLabels([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create Issue</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Issue Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Issue Type <span className="text-red-500">*</span></Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: 'Issue type is required' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='py-6 px-3 text-md mt-1 w-[350px] bg-gray-100'>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map((type) => (
                      <SelectItem className='m-1 text-lg hover:bg-gray-100' key={type.value} value={type.value}>
                        <span className="flex items-center gap-2 ">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.type.message}
              </p>
            )}
          </div>

          {/* Summary (name) */}
          <div className="space-y-2">
            <Label htmlFor="name">Summary <span className="text-red-500">*</span></Label>
            <Input

              id="name"
              placeholder="Enter issue summary"
              {...register('name', { required: 'Summary is required' })}
              className={errors.name ? 'border-red-500 p-4 py-6 px-3 text-md' : 'py-6 px-3 !text-md'}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Add a detailed description..."
              rows={4}
              {...register('description')}
              className="resize-none w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='py-6 px-3 text-md mt-1 w-[350px] bg-gray-100'>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <span className={`flex items-center gap-2 ${p.color}`}>
                          <Tag className="w-4 h-4" />
                          {p.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label htmlFor="assigneeId">Assignee</Label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value === 'unassigned' ? '' : value)}
                  value={field.value || 'unassigned'}
                >
                  <SelectTrigger className='py-6 px-3 text-md mt-1 w-[350px] bg-gray-100'>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          {user.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

                    {/* Reporter */}
          <div className="space-y-2">
            <Label htmlFor="assigneeId">Reporter</Label>
            <Controller
              name="reporterId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value === 'unassigned' ? '' : value)}
                  value={field.value || 'unassigned'}
                >
                  <SelectTrigger className='py-6 px-3 text-md mt-1 w-[350px] bg-gray-100'>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          {user.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Estimate */}
          <div>
            <Label htmlFor="estimate">Estimate (hours)</Label>
            <Input
              className='py-6 px-3 text-md mt-1 w-[350px] bg-gray-100'
              id="estimate"
              type="number"
              placeholder="Estimate(H)"
              {...register('estimate', { min: 0 })}
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input className='py-6 px-3 text-md mt-1 w-[350px] bg-gray-100' id="dueDate" type="date" {...register('dueDate')} />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <div className="flex items-center gap-3 mt-1">
              <Controller
                name="attachments"
                control={control}
                render={({ field }) => (
                  <FileUploader name={field.name} multiple onChange={field.onChange} />
                )}
              />
            </div>
          </div>

        {/* Footer */}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleFormSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Issue'}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
    </Dialog >
  );
};


// Demo Component
const CreateIssueDemo: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: IssueFormData) => {
    console.log('Issue created:', data);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Create Issue Modal Demo</h1>
        <Button onClick={() => setOpen(true)} size="lg">
          Create Issue
        </Button>
        <CreateIssueModal
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreateIssueDemo;