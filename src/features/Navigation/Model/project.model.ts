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
  user: User;
  project: Project;
  role: Role;
}