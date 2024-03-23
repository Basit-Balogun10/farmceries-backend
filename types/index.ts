import { SessionData } from "express-session"

export enum OrderStatus  {
    PENDING = "pending",
    COMPLETED = "completed",
}

export interface CustomSessionData extends SessionData {
    state?: string
}