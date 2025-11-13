import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { validateEmail } from '../../../utility/validator';
import ErrorHandler from '../../../common/component/ErrorHandler';
import '../../../css/pages/inviteInput.css';
import { Role, RoleEnum } from '../../../common/types/Auth/auth';
import Select from '../../../common/component/Select';
import projectService from '../service/project.service';
import { selectConverter } from '../../../utility/objectUtils';
import { Project } from '../Model/project.model';
import roleService from '../../../common/services/role.service';
import authService from '@/features/Authentication/service/auth.service';

type Props = {
  closeInviteModal: ()=>void
  userId: string;
};

interface FormData {
  email: string;
  projectId: string;
  role: string;
}

export const InviteEmail: React.FC<Props> = ({closeInviteModal }) => {
 const [alternateProjects, setAlternateProjects] = React.useState<Project[]>([]);
  const [roles, setRoles] = useState<Role[]>([])
  const projectOptions = useMemo(() => selectConverter(alternateProjects, (x) => x.projectId, (x) => x.name), [alternateProjects])
  const roleOptions = useMemo(() => selectConverter(roles, (x) => x.role_id, (x) => x.role), [roles])
  const { register, control, handleSubmit, reset,watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
      projectId: '',
      role: '',
    },
  });
  const watched = watch('projectId')
  console.log(watched)
  const submitFn = (email: string, pId: string, role: RoleEnum) => {
    authService.inviteUser({ email, pId, role })
    closeInviteModal()
}
  const fetchInviteResources = async <T, D>(fn1: () => Promise<T>, fn2: () => Promise<D>) => {
    const [resource1, resource2] = await Promise.all([fn1(), fn2()]);
    return { resource1, resource2 };
  };
  useEffect(() => {
    const fetchProjects = async () => await projectService.fetchUserProjects();
    const fetchRoles = async () => await roleService.fetchRoles()

    fetchInviteResources(fetchProjects, fetchRoles)
      .then((e) => {
        setAlternateProjects(e.resource1)
        setRoles(e.resource2)
      })
  }, []);

  const onSubmit = (data: FormData) => {
    submitFn(data.email, data.projectId, data.role as RoleEnum);
    reset();
  };

  return (
    <div className="container">
      <h5>Invite Your Friends!</h5>
      <p>
        Send an invitation to your mates to join your team! Fill out the form below to invite them via email.
        Simply enter their email addresses, and we'll take care of the rest.
      </p>
      <input
        className='input'
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
            classnames='select-Container'
            placeholder="Projects"
            onChange={(selected: any) => {
              console.log(selected)
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
            classnames='select-Container'
            placeholder="Roles"
            onChange={(selected: any) => {
              field.onChange(selected.id);
            }}
            options={roleOptions}
          />
        )}
      />
      {errors.role && <ErrorHandler fontSize="medium" text={errors.role.message} />}
      <div className='btn-container'>
        <button
          onClick={handleSubmit(onSubmit)}>
          Send
        </button>
      </div>

    </div>
  );
};
