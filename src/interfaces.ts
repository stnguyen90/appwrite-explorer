export interface User {
  $id: string;
  email: string;
  emailVerification: boolean;
  name: string;
  passwordUpdate: number;
  prefs: { [key: string]: string | number | boolean };
  registration: number;
  status: 0 | 1;
}

export interface Permissions {
  read: string[];
  write: string[];
}

export interface FileList {
  files: File[];
  sum: number;
}

export interface File {
  $id: string;
  $permissions: Permissions;
  name: string;
  dateCreated: number;
  signature: string;
  mimeType: string;
  sizeOriginal: number;
}

export interface ExecutionList {
  executions: Execution[];
  sum: number;
}

export interface Execution {
  $id: string;
  $permissions: Permissions;
  functionId: string;
  dateCreated: number;
  trigger: string;
  status: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  time: number;
}

export interface CommonListOptions {
  limit: number;
  offset: number;
}
