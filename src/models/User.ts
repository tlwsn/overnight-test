import mongoose from "mongoose";

export type IUserStatus = "Active" | "Inactive" | "Banned" | "Deleted";

export interface IUser {
    username: string;
    first_name: string;
    last_name: string;
    created_at?: Date;
    favorites?: mongoose.Schema.Types.ObjectId[];
    status?: IUserStatus;
}

const schema = new mongoose.Schema<IUser>({
    username: { type: "string", required: true, unique: true },
    first_name: { type: "string", required: true },
    last_name: { type: "string", required: true },
    created_at: { type: "Date" },
    favorites: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Book", unique: true },
    ],
    status: { type: "String", default: "Active" },
});

export default mongoose.model("User", schema);
