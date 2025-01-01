import{SignupType } from "../features/Authentication/Model/auth.model";

type excludeProfileProperties = 
'password_hash'
|'access_token'
|'created_at'
|'updated_at'
|'last_login'
|'is_active'
|'access_token'
|'refresh_token'
|'assigned_role'
|'isInvited';

export type EditProfileModel = Omit<SignupType, excludeProfileProperties>;