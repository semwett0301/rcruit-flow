import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { CreateUserDto } from '@repo/dto';

export const USERS_ENDPOINT = 'users';

const usersCreateApi = async (body: CreateUserDto) => {
  await axios.post<never>(USERS_ENDPOINT, body);
};

export const useUsersCreate = () =>
  useMutation({
    mutationKey: [USERS_ENDPOINT],
    mutationFn: usersCreateApi,
  });
