import { Role, User } from "@/common/types/Auth/auth";

export interface Project {
    id: string;           
    name: string;          
    owned_by: string;      
    lead_by: string;       
}

export interface UserProject {
  id: string;
  projectId: string;
  userId: string;
  roleId: string;
  isActive: boolean;
  first_name:string;
  last_name:string;
  project: Project;
  role: Role;
}