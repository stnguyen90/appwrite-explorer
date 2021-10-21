export interface CommonModel {
  $id: string;
}

export interface Permissions {
  read: string[];
  write: string[];
}

export interface CommonModelWithPermissions extends CommonModel {
  $permissions: Permissions;
}

export interface User extends CommonModel {
  email: string;
  emailVerification: boolean;
  name: string;
  passwordUpdate: number;
  prefs: { [key: string]: string | number | boolean };
  registration: number;
  status: 0 | 1;
}

export interface Document extends CommonModelWithPermissions {
  [key: string]: any;
}

export interface DocumentList {
  documents: Document[];
  sum: number;
}

export interface File extends CommonModelWithPermissions {
  name: string;
  dateCreated: number;
  signature: string;
  mimeType: string;
  sizeOriginal: number;
}

export interface FileList {
  files: File[];
  sum: number;
}

export interface Team extends CommonModel {
  name: string;
  dateCreated: number;
  sum: number;
}

export interface TeamsList {
  teams: Team[];
  sum: number;
}

export interface Membership extends CommonModel {
  userId: string;
  teamId: string;
  name: string;
  email: string;
  invited: number;
  joined: number;
  confirm: boolean;
  roles: string[];
}

export interface MembershipsList {
  memberships: Membership[];
  sum: number;
}

export interface Execution extends CommonModelWithPermissions {
  functionId: string;
  dateCreated: number;
  trigger: string;
  status: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  time: number;
}

export interface ExecutionList {
  executions: Execution[];
  sum: number;
}

export interface CommonListOptions {
  limit: number;
  offset: number;
}

export interface Payload {
  event: string;
  channels: string[];
  timestamp: number;
  payload: { [key: string]: any };
}
