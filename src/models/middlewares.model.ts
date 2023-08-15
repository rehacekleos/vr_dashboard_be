import express from "express";
import { User } from "../app/user/user.model";

export interface AuthMiddlewareResponse extends express.Request {
    user: User
}