import mongoose from "mongoose";
import dotenv from "dotenv";
import UserService from "../src/services/User.service";
import BookService from "../src/services/Book.service";
import User from "../src/models/User";
import Book from "../src/models/Book";

describe("Test 1", () => {
    beforeAll(async () => {
        dotenv.config();
        await mongoose.connect(process.env.MONGO_URL!, {
            dbName: process.env.MONGO_TEST_DB,
        });
    });

    it("Create user and book, add book to favorite and output their to console", async () => {
        const user = await UserService.create({
            username: "test",
            first_name: "test",
            last_name: "test",
        });
        expect(user.username).toBe("test");

        const book = await BookService.create({
            author: "test",
            title: "test",
            year: 2022,
        });
        expect(book.title).toBe("test");

        const users = await UserService.find({ limit: 5, page: 1 });
        console.log(users);

        const books = await BookService.find({ limit: 5, page: 1 });
        console.log(books);

        const updatedUser = await UserService.addToFavorite(
            user._id.toString(),
            book._id.toString()
        );
        console.log(updatedUser);
        expect(updatedUser.favorites.length).toBe(1);
        const us = await UserService.addToFavorite(
            user._id.toString(),
            book._id.toString()
        );
        console.log(us);
    });

    afterAll(async () => {
        await User.deleteMany();
        await Book.deleteMany();
        await mongoose.disconnect();
    });
});
