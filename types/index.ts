import { SessionData } from "express-session"

export enum OrderStatus  {
    PENDING = "pending",
    COMPLETED = "completed",
}

export interface CustomSessionData extends SessionData {
    state?: string
}

export enum AccountRole  {
    END_USER = 'end_user',
    VENDOR = 'vendor',
    FARMER = 'farmer',
    COURIER = 'courier',
}

export enum OTPChannel {
    EMAIL = 'email',
    SMS = 'sms',
}