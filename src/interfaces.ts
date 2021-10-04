export interface User {
  $id: string;
  email: string;
  emailVerification: boolean;
  name: string;
  passwordUpdate: number;
  prefs: { [key: string]: any };
  registration: number;
  status: 0 | 1;
}
