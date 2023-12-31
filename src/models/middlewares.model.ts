import express from "express";
import { User } from "../app/user/user.model";
import { Employee } from "../app/employee/employee.model";
import { Organisation } from "../app/organisation/organisation.model";

/**
 * Model of Auth middleware response
 */
export interface AuthMiddlewareResponse extends express.Request {
    /** User */
    user: User
}

/**
 * Model of Organisation middleware response
 */
export interface OrganisationMiddlewareResponse extends AuthMiddlewareResponse {
    /** Employee */
    employee: Employee;
    /** Organisation */
    organisation: Organisation
}