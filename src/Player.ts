import { Device } from "./Device";

const n = 'name';
export interface Player {
    name: string;
    pic: string;
    [Device.Mobile]?: string;
    [Device.Desktop]?: string;
}
