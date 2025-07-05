export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  method: "credentials" | "github" | "google";
  image?:string;
}
