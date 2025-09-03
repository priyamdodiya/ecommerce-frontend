export interface RegisterPayload {
  fullName: string;
  email: string;
  gender: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface UserData {
  id: string | number;
  fullName: string;
  username: string;
  email: string;
  gender: string;
  profilePhoto: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: UserData;
}