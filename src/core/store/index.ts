import {
  combineReducers,
  configureStore,
  isRejected,
  Middleware,
} from '@reduxjs/toolkit';
import { notification } from 'antd';
import PaymentReducer from './Payment.slice';
import UserReducer from './User.reducer';
import expenseReducer from './Expense.slice';
import revenueReducer from './Revenue.slice';
import entriesCategoryReducer from './EntriesCategory.slice';
import authReducer from './Auth.slice';

const observeActions: Middleware = () => (next) => (action) => {
  if (isRejected(action)) {
    const ignoredActions = [
      'cash-flow/categories/getCategories/rejected',
      'cash-flow/categories/createCategory/rejected',
      'cash-flow/categories/deleteCategory/rejected',
      'cash-flow/expenses/getExpenses/rejected',
      'cash-flow/expenses/createExpense/rejected',
      'cash-flow/revenue/getRevenues/rejected',
      'cash-flow/revenues/createRevenue/rejected',
      'user/getAllUsers/rejected',
      'payment/getAllPayments/rejected',
    ];

    const shouldNotify = !ignoredActions.includes(action.type);

    if (shouldNotify) {
      notification.error({
        message: action.error.message,
      });
    }
  }
  next(action);
};

const cashFlowReducer = combineReducers({
  expense: expenseReducer,
  revenue: revenueReducer,
  category: entriesCategoryReducer,
});

export const store = configureStore({
  reducer: {
    user: UserReducer,
    payment: PaymentReducer,
    cashFlow: cashFlowReducer,
    auth: authReducer,
  },
  middleware: function (getDefaultMiddlewares) {
    return getDefaultMiddlewares().concat(observeActions);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
