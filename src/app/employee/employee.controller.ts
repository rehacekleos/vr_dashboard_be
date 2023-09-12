import { BaseController } from "../../shared/controllers/base.controller";
import { OrganisationService } from "../organisation/organisation.service";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { OrganisationMiddlewareResponse } from "../../models/middlewares.model";
import express from "express";
import { HttpException } from "../../shared/exceptions/HttpException";
import { organisationMiddleware } from "../../shared/middlewares/organisation.middleware";
import { EmployeeService } from "./employee.service";

export class EmployeeController extends BaseController{
    path = '/employee';

    constructor(private employeeService: EmployeeService) {
        super();
        this.initRouter();
    }

    initRouter(): void {
        this.router.get('/', [authMiddleware, organisationMiddleware], this.getEmployees);
    }

    getEmployees = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const result = await this.employeeService.getEmployeesForOrg(orgId);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get employees.', e));
        }
    };
}