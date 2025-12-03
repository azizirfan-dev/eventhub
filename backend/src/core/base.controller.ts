import { Request, Response } from "express";

export class BaseController { 
    protected sendSuccess(res: Response, data: any, message: string = "Success") { 
        return res.status(200).json({ status: "success", message, data });   
    }

    protected sendError( res: Response, error: any, status: number = 400) { 
        return res.status(status).json({ 
            status:"error",
            message: error?.message || "Something went wrong",
        });
    }
};

