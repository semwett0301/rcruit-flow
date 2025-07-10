import { randomUUID } from "crypto";

export class StringId {
  constructor(private readonly value: string = randomUUID()) {
    if (!value || value.length < 5) {
      throw new Error("Invalid ID");
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: StringId): boolean {
    return this.value === other.value;
  }
}
