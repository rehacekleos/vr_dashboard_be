import { AuthMiddlewareResponse, OrganisationMiddlewareResponse } from "../../models/middlewares.model";
import express, { NextFunction } from "express";
import { JwtUtil } from "../utils/jwt.util";
import { UserDataAccess } from "../../app/user/user.dataAccess";
import { User } from "../../app/user/user.model";
import { HttpException } from "../exceptions/HttpException";
import { EmployeeDataAccess } from "../../app/employee/employee.dataAccess";
import { isEmptyAndNull } from "../utils/common.util";
import { OrganisationDataAccess } from "../../app/organisation/organisation.dataAccess";


export async function organisationMiddleware(request: OrganisationMiddlewareResponse, response: express.Response, next: NextFunction) {
    const organisationId = request.header('x-organisation-id');
    const user = request.user;

    if (organisationId && user.id) {
        try {
            const orgDa = OrganisationDataAccess.getInstance();
            const organisation = await orgDa.getOrganisationById(organisationId);
            if (isEmptyAndNull(organisation)){
                next(new HttpException(401, "Organisation not found."));
                return;
            }

            const employeeDa = EmployeeDataAccess.getInstance();
            const employee = await employeeDa.getEmployeeForOrgAndUser(organisationId, user.id);
            if (isEmptyAndNull(employee)){
                next(new HttpException(401, "The user does not have access to the organisation."));
                return;
            }

            request.organisation = organisation;
            request.employee = employee;
            next()
        } catch (error) {
            next(new HttpException(401, "The user does not have access to the organisation."));
        }
    } else {
        next(new HttpException(401, "The user does not have access to the organisation."));
    }
}