import Book, { IBook } from "../models/Book";
import HttpException from "../utils/HttpException";

export type TBook = Omit<IBook, "created_at">;
export type UpdateBook = Partial<TBook>;

class BookService {
    async create(book: TBook) {
        const newBook = new Book({ ...book, created_at: new Date() });
        await newBook.save();
        return newBook;
    }

    async find({
        author,
        limit = 5,
        page = 1,
    }: {
        author?: string;
        limit: number;
        page: number;
    }) {
        const books = await Book.find(author ? { author: author } : {})
            .limit(limit)
            .skip((page - 1) * limit);
        return books;
    }

    async findOne(_id: string) {
        const book = await Book.findOne({ _id });
        if (!book) throw new HttpException(404, "Book not found");
        return book;
    }

    async deleteOne(_id: string) {
        await this.findOne(_id);
        await Book.deleteOne({ _id });
    }

    async updateOne(_id: string, data: UpdateBook) {
        await this.findOne(_id);
        await Book.updateOne({ _id }, { $set: data });
        const book = await this.findOne(_id);
        return book;
    }
}

export default new BookService();
