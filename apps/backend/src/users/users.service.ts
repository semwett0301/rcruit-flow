import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserNotFoundException } from '../common/exceptions';
import { UpdateUserDto } from '@rcruit-flow/dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Find a user by their ID
   * @param id - The user's unique identifier
   * @returns The user if found
   * @throws UserNotFoundException if user doesn't exist
   */
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  /**
   * Update a user's information
   * @param id - The user's unique identifier
   * @param updateUserDto - The data to update
   * @returns The updated user
   * @throws UserNotFoundException if user doesn't exist
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserNotFoundException(id);
    }

    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }

    return this.usersRepository.save(user);
  }

  /**
   * Remove a user from the system
   * @param id - The user's unique identifier
   * @throws UserNotFoundException if user doesn't exist
   */
  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserNotFoundException(id);
    }

    await this.usersRepository.remove(user);
  }
}
