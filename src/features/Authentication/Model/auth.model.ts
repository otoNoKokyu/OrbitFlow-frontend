import { RoleEnum } from "../../../common/types/Auth/auth";

export type LoginType = {
    email: string;
    password: string;
}
export type SignupType = {
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

export interface Signup {
    email: string;
    username: string;
    expiresIn: number
}
export interface Login {
    access_token: string;
    refresh_token: string;
}
export type sendOtp  = Pick<Signup,'expiresIn'>;
export interface Token extends Login {};