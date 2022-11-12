import { JSONSchemaType } from "ajv";
import { Router } from "express";
import { IUserStatus } from "../models/User";
import UserService, { TUser } from "../services/User.service";
import { validateBody } from "../utils/middleware";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const users = await UserService.find({ page, limit });

        res.json({ success: true, data: users });
    } catch (e) {
        next(e);
    }
});

const addSchema: JSONSchemaType<TUser> = {
    type: "object",
    properties: {
        first_name: { type: "string" },
        last_name: { type: "string" },
        username: { type: "string" },
    },
    required: ["first_name", "last_name", "username"],
};

router.post("", validateBody(addSchema), async (req, res, next) => {
    try {
        const user = await UserService.create(req.body);
        res.json({ success: true, data: user });
    } catch (e) {
        next(e);
    }
});

const deleteSchema: JSONSchemaType<{ id: string }> = {
    type: "object",
    properties: {
        id: { type: "string" },
    },
    required: ["id"],
};

router.delete("/", validateBody(deleteSchema), async (req, res, next) => {
    try {
        await UserService.deleteOne(req.body.id);
        res.json({ success: true });
    } catch (e) {
        next(e);
    }
});

const updateSchema: JSONSchemaType<{ id: string; status: IUserStatus }> = {
    type: "object",
    properties: {
        id: { type: "string" },
        status: {
            type: "string",
            enum: ["Active", "Banned", "Deleted", "Inactive"],
        },
    },
    required: ["id", "status"],
};

router.put("/", validateBody(updateSchema), async (req, res, next) => {
    try {
        const user = await UserService.updateStatus(
            req.body.id,
            req.body.status
        );
        res.json({ success: true, data: user });
    } catch (e) {
        next(e);
    }
});

router.get("/login", async (req, res, next) => {
    try {
        const username = req.query.username as string;
        const user = await UserService.findOne({ username });
        console.log(user);

        const payload = {
            _id: user._id.toString(),
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
            expiresIn: "2h",
        });
        res.json({ success: true, token });
    } catch (e) {
        next(e);
    }
});

router.put("/addBook", async (req, res, next) => {
    try {
        console.log(req.user);

        await UserService.addToFavorite(req.user!._id, req.body.book_id);
        res.json({ success: true });
    } catch (e) {
        next(e);
    }
});

export default router;
