export type LoginType = {
    email: string;
    password: string;
}
export interface ProviderProps {
    user:  IUser,
    tokens: Record<string,string>
    setUserMeta: (data: IUser) => void,
    login: (data: LoginType ) => Promise<boolean>,
    logout() :void,
}
enum RoleEnum {
    GUEST = 'GUEST',
    DEV = 'DEV',
    MANAGER = 'MANAGER',
    LEAD = 'LEAD',
    PRODUCT_OWNER = 'PRODUCT_OWNER',
    QA = 'QA',
    ADMIN = 'ADMIN',
  }
export interface IUser {
  user_id: string;
  username: string;
  password_hash: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: Date;
  gender?: 'Male' | 'Female' | 'Other';
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  profile_picture_url?: string;
  created_at?: Date;
  updated_at?: Date;
  last_login?: Date;
  is_active: boolean;
  access_token: string;
  refresh_token: string;
  assigned_role: RoleEnum;
  isInvited?: boolean;
}

export interface SignupBasics {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  username: string;
}

export interface SignupAddress {
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface DefaultValues {
  signupbasics: SignupBasics;
  signupaddress: SignupAddress;
}
