import Ajv, { JSONSchemaType } from "ajv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserService from "../services/User.service";

export function validateBody<T>(schema: JSONSchemaType<T>) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    return (req: Request<{}, {}, T>, res: Response, next: NextFunction) => {
        if (!validate(req.body))
            return res
                .status(400)
                .json({ success: false, errors: validate.errors });
        req.body = req.body as T;
        return next();
    };
}

export async function validateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.path == "/users/login") {
        const username = req.query.username as string | undefined;
        if (!username)
            return res
                .status(400)
                .json({ success: false, message: "username missed" });
        const user = await UserService.findOne({ username });
        if (!user)
            return res.json({
                success: false,
                error: `User ${username} is not exist`,
            });
        if (user.status != "Active")
            return res.json({
                success: false,
                error: `User ${username} is ${user.status}`,
            });
        return next();
    }

    const authToken = req.headers["authorization"] as string | undefined;
    if (!authToken) return res.json({ success: false, error: "Auth error" });
    const token = authToken.split(" ")[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
            _id: string;
        };
        next();
    } catch (e: any) {
        return res.json({ success: false, error: e.message });
    }
}
