import { QueryOptions } from "mysql";

export type ConnectFunction = () => Promise<unknown>;
export type QueryFunction = (req: string | QueryOptions) => Promise<unknown>;
export type EndFunction = () => Promise<void>;
