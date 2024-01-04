import { BaseController } from "../../shared/controllers/base.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { OrganisationMiddlewareResponse } from "../../models/middlewares.model";
import express from "express";
import { HttpException } from "../../shared/exceptions/HttpException";
import { organisationMiddleware } from "../../shared/middlewares/organisation.middleware";
import { EmployeeService } from "./employee.service";
import { AssignParticipantsModel, ChangeRoleModel } from "./employee.model";

/**
 * Controller for entity Employee
 */
export class EmployeeController extends BaseController{
    /** Controller base route */
    readonly path = '/employee';

    /**
     *
     * @param employeeService
     */
    constructor(private employeeService: EmployeeService) {
        super();
        this.initRouter();
    }

    initRouter(): void {
        this.router.get('/', [authMiddleware, organisationMiddleware], this.getEmployees);
        this.router.get('/user', [authMiddleware, organisationMiddleware], this.getEmployeeForUser);
        this.router.put('/assignment', [authMiddleware, organisationMiddleware], this.assignParticipants);
        this.router.patch('/role', [authMiddleware, organisationMiddleware], this.changeEmployeeRole);
        this.router.delete('/:id', [authMiddleware, organisationMiddleware], this.deleteEmployee);
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

    getEmployeeForUser = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const user = req.user;
            const result = await this.employeeService.getEmployeeForOrgAndUser(orgId, user.id);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get employees.', e));
        }
    };

    assignParticipants = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const user = req.user;
            const emp = req.employee;
            const assign: AssignParticipantsModel = req.body;
            const result = await this.employeeService.assignParticipants(assign, orgId, user, emp);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get employees.', e));
        }
    };

    changeEmployeeRole = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const user = req.user;
            const emp = req.employee;
            const changeRole: ChangeRoleModel = req.body;
            const result = await this.employeeService.changeEmployeeRole(changeRole, orgId, user, emp);
            res.status(200).json(result);
        } catch (e) {
            if (e instanceof HttpException){
                next(e);
                return;
            }
            next(new HttpException(400, 'Cannot get employees.', e));
        }
    };

    deleteEmployee = async (req: OrganisationMiddlewareResponse, res: express.Response, next) => {
        try {
            const orgId = req.organisation.id;
            const user = req.user;
            const emp = req.employee;
            const empId = req.params.id;
            const result = await this.employeeService.deleteEmployee(empId, orgId, user, emp);
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