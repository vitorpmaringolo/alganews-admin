import { User, UserService } from 'vitorpmaringolo-sdk';
import { ResourceNotFoundError } from 'vitorpmaringolo-sdk/dist/errors';
import { useCallback, useState } from 'react';

export default function useUser() {
  const [user, setUser] = useState<User.Detailed>();
  const [notFound, setNotFound] = useState(false);

  const fetchUser = useCallback(async (userId: number) => {
    try {
      await UserService.getDetailedUser(userId).then(setUser);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        setNotFound(true);
      } else {
        throw error;
      }
    }
  }, []);

  const toggleUserStatus = useCallback((user: User.Summary | User.Detailed) => {
    return user.active
      ? UserService.deactivateExistingUser(user.id)
      : UserService.activateExistinguser(user.id);
  }, []);

  return {
    user,
    fetchUser,
    notFound,
    toggleUserStatus,
  };
}
