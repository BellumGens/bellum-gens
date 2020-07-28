export interface UserRegistration {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export interface UserLogin {
  username: string;
  password: string;
  rememberMe: boolean;
}
