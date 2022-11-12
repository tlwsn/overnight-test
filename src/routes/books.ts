import { JSONSchemaType } from "ajv";
import { Router } from "express";
import BookService, { TBook, UpdateBook } from "../services/Book.service";
import { validateBody } from "../utils/middleware";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const author = req.query.author as string | undefined;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const books = await BookService.find({ author, page, limit });

        res.json({ success: true, data: books });
    } catch (e) {
        next(e);
    }
});

const addSchema: JSONSchemaType<TBook> = {
    type: "object",
    properties: {
        author: { type: "string" },
        title: { type: "string" },
        year: { type: "integer" },
    },
    required: ["author", "title", "year"],
};

router.post("/", validateBody(addSchema), async (req, res, next) => {
    try {
        const book = await BookService.create(req.body);
        res.json({ success: true, data: book });
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
        await BookService.deleteOne(req.body.id);
        res.json({ success: true });
    } catch (e) {
        next(e);
    }
});

const updateSchema: JSONSchemaType<{ _id: string; data: UpdateBook }> = {
    type: "object",
    properties: {
        _id: { type: "string" },
        data: {
            type: "object",
            properties: {
                author: { type: "string", nullable: true },
                title: { type: "string", nullable: true },
                year: { type: "integer", nullable: true },
            },
        },
    },
    required: ["_id"],
};

router.put("/", validateBody(updateSchema), async (req, res, next) => {
    try {
        const book = await BookService.updateOne(req.body._id, req.body.data);
        return res.json({ success: true, data: book });
    } catch (e) {
        next(e);
    }
});

export default router;
