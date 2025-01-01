import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { validateEmail } from '../../../utility/validator';
import ErrorHandler from '../../../common/component/ErrorHandler';
import '../../../css/pages/inviteInput.css';
import { RoleEnum } from '../../../common/types/Auth/auth';
import Select from '../../../common/component/Select';
import projectService from '../service/project.service';

type Props = {
  submitFn: (email: string, pId: string, role: RoleEnum) => void;
  projects: { id: string; label: string }[];
};

interface FormData {
  email: string;
  projectId: string;
  role: string;
}

export const InviteEmail: React.FC<Props> = ({ submitFn, projects }) => {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
      projectId: '',
      role: '',
    },
  });

  const [alternateProjects, setAlternateProjects] = React.useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!projects.length) {
        const res = await projectService.fetchProjects();
        if (res.length) {
          const formattedProjects = res.map((e: any) => ({
            id: e.id,
            label: e.name,
          }));
          setAlternateProjects(formattedProjects);
        }
      }
    };

    fetchProjects();
  }, [projects]);

  const roles = [
    { id: '', label: 'GUEST' },
    { id: '', label: 'DEV' },
    { id: '', label: 'MANAGER' },
    { id: '', label: 'LEAD' },
    { id: '', label: 'PRODUCT_OWNER' },
    { id: '', label: 'QA' },
    { id: '', label: 'ADMIN' },
  ];

  const projectOptions = useMemo(() => (projects.length ? projects : alternateProjects), [projects, alternateProjects]);

  const onSubmit = (data: FormData) => {
    submitFn(data.email, data.projectId, data.role as RoleEnum);
    reset();
  };

  return (
    <div className="container">
      <h2>Invite Your Friends!</h2>
      <p>
        Send an invitation to your mates to join your team! Fill out the form below to invite them via email.
        Simply enter their email addresses, and we'll take care of the rest.
      </p>
      <input
        type="text"
        {...register('email', {
          required: 'email is a required field',
          validate: validateEmail
        })}
        placeholder="Email"
      />
      {errors.email && <ErrorHandler fontSize="medium" text={errors.email.message} />}

      <Controller
        name="projectId"
        control={control}
        rules={{ required: "please select a project" }}
        render={({ field }) => (
          <Select
            {...field}
            classnames='mx-auto'
            placeholder="Projects"
            onChange={(selected: any) => {
              field.onChange(selected.id);
            }}
            options={projectOptions}
          />
        )}
      />
      {errors.projectId && <ErrorHandler fontSize="medium" text={errors.projectId.message} />}

      <Controller
        name="role"
        control={control}
        rules={{ required: "please select a role" }}
        render={({ field }) => (
          <Select
            {...field}
            classnames='mx-auto'
            placeholder="Roles"
            onChange={(selected: any) => {
              field.onChange(selected.label);
            }}
            options={roles}
          />
        )}
      />
      {errors.role && <ErrorHandler fontSize="medium" text={errors.role.message} />}

      <button onClick={handleSubmit(onSubmit)}>
        Send
      </button>
    </div>
  );
};
