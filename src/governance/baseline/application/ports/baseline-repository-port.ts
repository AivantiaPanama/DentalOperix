import type { BaselineDescriptor } from "../../domain/entities/baseline-descriptor";
import type { BaselineVersion } from "../../domain/value-objects/baseline-version";

export interface BaselineRepositoryPort {
  getByVersion(version: BaselineVersion): Promise<BaselineDescriptor | null> | BaselineDescriptor | null;
  getActive(): Promise<BaselineDescriptor | null> | BaselineDescriptor | null;
}
