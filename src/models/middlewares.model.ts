import express from "express";
import { User } from "../app/user/user.model";
import { Employee } from "../app/employee/employee.model";
import { Organisation } from "../app/organisation/organisation.model";

export interface AuthMiddlewareResponse extends express.Request {
    user: User
}

export interface OrganisationMiddlewareResponse extends AuthMiddlewareResponse {
    employee: Employee;
    organisation: Organisation
}