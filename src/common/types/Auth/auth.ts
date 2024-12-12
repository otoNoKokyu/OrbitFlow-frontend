import { LoginType } from "../../../features/Authentication/Model/auth.model";

export interface ProviderProps {
    user:  User | null,
    tokens: {} | null,
    setUserMeta: (data: User ) => void,
    login: (data: LoginType ) => Promise<boolean>,
    logout() :void,
}
export enum RoleEnum {
    GUEST = 'GUEST',
    DEV = 'DEV',
    MANAGER = 'MANAGER',
    LEAD = 'LEAD',
    PRODUCT_OWNER = 'PRODUCT_OWNER',
    QA = 'QA',
    ADMIN = 'ADMIN',
  }
export enum KeyMeta {
  TOKEN = 'tokens',
  USER = 'me'
}
export type User = {
  username?: string | null;
  access_token?: string | null;
  refresh_token?:string | null;
}
// export interface User {
//   user_id: string;
//   username: string;
//   password_hash: string;
//   email: string;
//   first_name?: string;
//   last_name?: string;
//   date_of_birth?: Date;
//   gender?: 'Male' | 'Female' | 'Other';
//   phone_number?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   zip_code?: string;
//   profile_picture_url?: string;
//   created_at?: Date;
//   updated_at?: Date;
//   last_login?: Date;
//   is_active: boolean;
//   access_token: string;
//   refresh_token: string;
//   assigned_role: RoleEnum;
//   isInvited?: boolean;
// }

export type Child<T> = {
  component: (ref: React.RefObject<T>, className?: string) => JSX.Element;
};
export type StepperComponent = Array<Child<HTMLDivElement| HTMLInputElement>> 
export interface StepperForm<T> {
  title?: string;
  children: StepperComponent
  saveFn: (data: T) => Promise<void>;
};