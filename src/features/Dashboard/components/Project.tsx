import React from 'react';
import { useForm } from 'react-hook-form';
import '../../../css/components/projectForm.css';
import ErrorHandler from '../../../common/component/ErrorHandler';

interface ProjectFormData {
  name: string;
  start_date: string;
  end_date: string;
  min_issue_count: number;
  lead_by: string;
}

const ProjectForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>();

  const onSubmit = (data: ProjectFormData) => {
    console.log('Form data submitted:', data);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Create or Edit Project</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name">Project Name:</label>
            <input
              type="text"
              id="name"
              {...register('name', { required: true })}
            />
            {errors.name && <ErrorHandler text="This field is required." />}
          </div>

          <div className="date-picker-container">
            <div className="form-group">
              <label htmlFor="start_date">Start Date:</label>
              <input
                type="date"
                id="start_date"
                {...register('start_date', { required: true })}
              />
              {errors.start_date && <ErrorHandler text="This field is required." />}
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date:</label>
              <input
                type="date"
                id="end_date"
                {...register('end_date')}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="min_issue_count">Min Issue Count:</label>
            <input
              type="number"
              id="min_issue_count"
              {...register('min_issue_count')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lead_by">Lead:</label>
            <input
              type="text"
              id="lead_by"
              {...register('lead_by')}
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
