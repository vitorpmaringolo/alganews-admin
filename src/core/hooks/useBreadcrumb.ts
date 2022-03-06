import { RootState } from './../store/index';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setBreadcrumb } from '../store/UI.slice';

export default function useBreadcrumb(newBreadcrumb?: string) {
  const dispatch = useDispatch();
  const breadcrumb = useSelector((s: RootState) => s.ui.breadcrumb);

  useEffect(() => {
    if (newBreadcrumb) dispatch(setBreadcrumb(newBreadcrumb.split('/')));
  }, [dispatch, newBreadcrumb]);

  return {
    breadcrumb,
  };
}
