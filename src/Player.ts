import { Device } from "./Device";

const n = 'name';
export interface User {
    name: string;
    pic: string;
    [Device.Mobile]?: string;
    [Device.Desktop]?: string;
}
