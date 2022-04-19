export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    statcode?: string; // statcode is not necessary for admin
    password: string;
    admin: boolean;
}
