import mongoose from "mongoose";

export interface IBook {
    title: string;
    author: string;
    year: number;
    created_at?: Date;
}

const schema = new mongoose.Schema<IBook>({
    author: { type: "string", required: true },
    title: { type: "string", required: true },
    year: { type: "number", required: true },
    created_at: { type: "Date" },
});

export default mongoose.model("Book", schema);
