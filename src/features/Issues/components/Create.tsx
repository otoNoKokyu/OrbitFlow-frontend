import React, { useEffect, useMemo, useState } from 'react';
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
import FileUploader, { FileWithId } from '@/components/ui/Fileuploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useFetch } from '@/hooks/useFetch';
import userProjectService from '@/features/Navigation/service/project.service';
import { selectConverter } from '@/utility/objectUtils';
import { issueTypes, priorities } from '../constants/issue.constant';
import { creatIssue } from '../service/issue.service';
import { IssueFormData } from '../interface/issue.interfcae';
// Types

interface CreateIssueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  projectId?: string;
  parentId?: string
}


export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  open,
  onClose,
  onSubmit,
  parentId,
  projectId = '020212ea-0e5a-48d9-9ea4-3dbc045fe166'
}) => {

  const { register, handleSubmit, control, formState: { isSubmitting }, reset, setValue } = useForm<IssueFormData>();
  const { data: assigneesAndReporter, loading } = useFetch(userProjectService.fetchUsersInProjects, projectId);
  const projectUserOptions = selectConverter(assigneesAndReporter ?? [], (x) => x?.userId, (x) => `${x.first_name} ${x.last_name}`);
  console.log(projectUserOptions)


  const handleFormSubmit = async (data: IssueFormData) => {
    try {
      const formData = new FormData();
      formData.append("type", data.type);
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("priority", data.priority || "");
      formData.append("assigneeId", data.assigneeId || "");
      formData.append("reporterId", data.reporterId || "");
      formData.append("estimate", data.estimate || '');
      formData.append('projectId', projectId)
      if (parentId) formData.append('parentId', parentId)

      data.attachments?.forEach((file) => formData.append("attachments", file));
      await onSubmit(formData);
      reset()
      onClose();
    } catch (err) {
      console.error('Submit failed:', err);
      reset()
    }
  };

  useEffect(() => {
    if (parentId) setValue("type", "subtask");
  }, [parentId, open]);

  if (loading) return null;

  const handleClose = () => {
    reset();
    onClose();
    reset()
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create Issue</DialogTitle>
        </DialogHeader>

        <form className='space-y-6' onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="type">Issue Type <span className="text-red-500">*</span></Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: 'Issue type is required' }}
              render={({ field, fieldState: { error } }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={!!parentId}>
                  <SelectTrigger className={`py-6 px-3 text-md mt-1 w-[350px] bg-gray-100 ${error
                    ? "border-red-500 p-4 py-6 px-3 text-md"
                    : "py-6 px-3 !text-md"}`}>
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
          </div>

          {/* Summary (name) */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Summary <span className="text-red-500">*</span>
            </Label>

            <Controller
              name="name"
              control={control}
              rules={{ required: "Summary is required" }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="name"
                  placeholder="Enter issue summary"
                  {...field}
                  className={
                    error
                      ? "border-red-500 p-4 py-6 px-3 text-md"
                      : "py-6 px-3 !text-md"
                  }
                />
              )}
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
                  onValueChange={(value) => {
                    console.log(value)
                    field.onChange(value ?? '')
                  }}
                  value={field.value}
                >
                  <SelectTrigger disabled={loading} className='py-6 px-3 text-md mt-1 w-[350px] bg-gray-100'>
                    <SelectValue placeholder="select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {projectUserOptions.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className='!bg-gray-300'>{user.label[0]}</AvatarFallback>
                          </Avatar>
                          {user.label}
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
            <Label htmlFor="reporterId">Reporter</Label>
            <Controller
              name="reporterId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value ?? '')}
                  value={field.value}
                >
                  <SelectTrigger disabled={loading} className='py-6 px-3 text-md mt-1 w-[350px] bg-gray-100'>
                    <SelectValue placeholder="select reporter" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="unassigned">Unassigned</SelectItem> */}
                    {projectUserOptions.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className='!bg-gray-300'>{user.label[0]}</AvatarFallback>
                        </Avatar>
                        {user.label}
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

          {/* Attachments */}
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <div className="flex items-center gap-3 mt-1">
              <Controller
                name="attachments"
                control={control}
                render={({ field }) => (
                  <FileUploader
                    name='attachments'
                    value={field.value ?? []}
                    onChange={(files) => field.onChange(files)}
                  />
                )}
              />
            </div>
          </div>


          {/* Footer */}
          <DialogFooter className="gap-2">
            <Button variant="outline" type='reset' onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Issue'}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog >
  );
};


const CreateIssueDemo: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await creatIssue(formData);
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