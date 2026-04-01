import API_URL from "./api";
import { io } from "socket.io-client";

export const socket = io(API_URL);
