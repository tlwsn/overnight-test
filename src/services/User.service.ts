import { IBook } from "../models/Book";
import User, { IUser, IUserStatus } from "../models/User";
import HttpException from "../utils/HttpException";
import BookService from "./Book.service";

export type TUser = Omit<
    Omit<Omit<IUser, "created_at">, "favorites">,
    "status"
>;

class UserService {
    async create(user: TUser) {
        const newUser = new User({ ...user, created_at: new Date() });
        await newUser.save();
        return newUser;
    }

    async findOne(data: { _id?: string; username?: string }) {
        const user = await User.findOne(data).populate<{
            favorites: IBook[];
        }>("favorites");
        if (!user) throw new HttpException(404, "User not found");
        return user;
    }

    async find({ limit = 5, page = 1 }: { limit: number; page: number }) {
        const users = await User.find()
            .populate<{
                favorites: IBook[];
            }>("favorites")
            .limit(limit)
            .skip((page - 1) * limit);
        return users;
    }

    async updateStatus(_id: string, status: IUserStatus) {
        await this.findOne({ _id });
        await User.updateOne({ _id }, { $set: { status } });
        const user = await this.findOne({ _id });
        return user;
    }

    async deleteOne(_id: string) {
        await this.findOne({ _id });
        await User.deleteOne({ _id });
    }

    async addToFavorite(user_id: string, book_id: string) {
        await this.findOne({ _id: user_id });
        const book = await BookService.findOne(book_id);

        await User.updateOne(
            { _id: user_id },
            { $addToSet: { favorites: book._id } }
        );

        const user = await this.findOne({ _id: user_id });
        return user;
    }
}

export default new UserService();
