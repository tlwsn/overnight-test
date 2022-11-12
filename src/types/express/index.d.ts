import { IUser } from "../../models/User";

export {};

declare global {
    namespace Express {
        export interface Request {
            user?: { _id: string };
        }
    }
}
