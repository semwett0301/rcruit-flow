import { StringId } from "@/shared/value-objects/string-id.vo";

export class UserDomainEntity {
  constructor(
    private _name: string,
    private _email: string,
    public readonly id: StringId = new StringId()
  ) {}

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }
}
