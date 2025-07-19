import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { CreateUserDto } from '@repo/dto';
import { toast } from 'react-toastify';

export const USERS_ENDPOINT = 'users';

const usersCreateApi = async (body: CreateUserDto) => {
  await axios.post<never>(USERS_ENDPOINT, body);
};

const usersCreateQueryFn = async (body: CreateUserDto) => {
  try {
    await usersCreateApi(body);
  } catch (error) {
    if (axios.isAxiosError(error) && error?.response) {
      toast.error(error.message);
    }
  }
};

export const useUsersCreate = () =>
  useMutation({
    mutationKey: [USERS_ENDPOINT],
    mutationFn: usersCreateQueryFn,
  });
