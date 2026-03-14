export type DbId = string;
export type DbTimestamp = string;

export interface DbEntity {
  id: DbId;
  createdAt: DbTimestamp;
  updatedAt: DbTimestamp;
}

export type DbStatus = "pending" | "processing" | "ready" | "failed";

export type DbRecord<T> = T & DbEntity;

export type DbJson = Record<string, unknown>;
