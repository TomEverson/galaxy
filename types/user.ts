export interface User {
  id?: string;
  email: string;
  password: string;
}

export interface Session {
  _id?: string;
  email: string;
  password?: string;
  code: number;
}
