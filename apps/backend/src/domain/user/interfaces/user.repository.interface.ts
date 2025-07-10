import { UserDomainEntity } from "@/domain/user/enities/user.domain.entity";

export interface IUserRepository {
  save(user: UserDomainEntity): Promise<void>;
}

export const IUserRepository = Symbol("IUserRepository");
