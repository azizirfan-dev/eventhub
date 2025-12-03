import { prisma } from "../config/database";

export class BaseService { 
    protected prisma = prisma
};