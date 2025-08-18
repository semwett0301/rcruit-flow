import { useUsersCreate } from 'queries/api/users/usersCreate';
import { CreateUserRequest } from '@repo/dto';
import { useCallback } from 'react';

export const useAuth = () => {
  const { mutateAsync: createUser } = useUsersCreate();

  const registerUser = useCallback(
    (userEntity: CreateUserRequest) =>
      createUser(userEntity)
        .then(() => {
          const { name, email } = userEntity;

          window.localStorage.setItem('name', name);
          window.localStorage.setItem('email', email);
        })
        .catch((error) => {
          console.log(error);
        }),
    [createUser],
  );

  const getUser = useCallback(() => {
    const name = window.localStorage.getItem('name') ?? '';
    const email = window.localStorage.getItem('email') ?? '';

    return { name, email };
  }, []);

  return { registerUser, getUser };
};
