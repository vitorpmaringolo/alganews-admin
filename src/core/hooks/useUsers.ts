import { AppDispatch } from './../store/index';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from 'vitorpmaringolo-sdk';
import * as UserActions from '../store/User.reducer';
import { RootState } from '../store/index';

export default function useUsers() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.list);

  const editors = useSelector((state: RootState) =>
    state.user.list.filter((user) => user.role === 'EDITOR')
  );

  const fetching = useSelector((state: RootState) => state.user.fetching);

  const fetchUsers = useCallback(() => {
    return dispatch(UserActions.getAllUsers()).unwrap();
  }, [dispatch]);

  const toggleUserStatus = useCallback(
    async (user: User.Detailed | User.Summary) => {
      await dispatch(UserActions.toggleUserStatus(user));
      dispatch(UserActions.getAllUsers());
    },
    [dispatch]
  );

  return {
    fetchUsers,
    users,
    editors,
    fetching,
    toggleUserStatus,
  };
}
