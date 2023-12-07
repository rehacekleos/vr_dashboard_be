import { AuthMiddlewareResponse, OrganisationMiddlewareResponse } from "../../models/middlewares.model";
import express, { NextFunction } from "express";
import { OrganisationDataAccess } from "../../app/organisation/organisation.dataAccess";
import { isEmptyAndNull } from "../utils/common.util";
import { HttpException } from "../exceptions/HttpException";
import { EmployeeDataAccess } from "../../app/employee/employee.dataAccess";

export async function adminMiddleware(request: AuthMiddlewareResponse, response: express.Response, next: NextFunction) {
    const user = request.user;

    if (!isEmptyAndNull(user) && (user.superAdmin === true || user.developer === true)) {
        next()
    } else {
        next(new HttpException(401, "The user is not an admin."));
    }
}