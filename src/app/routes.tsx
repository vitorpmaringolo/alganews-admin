import { message, notification } from 'antd';
import { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import CustomError from 'vitorpmaringolo-sdk/dist/CustomError';
import CashFlowExpensesView from './views/CashFlowExpenses.view';
import CashFlowRevenuesView from './views/CashFlowRevenues.view';
import HomeView from './views/Home.view';
import PaymentCreateView from './views/PaymentCreate.view';
import PaymentDetailsView from './views/PaymentDetails.view';
import PaymentListView from './views/PaymentList.view';
import UserCreateView from './views/UserCreate.view';
import UserDetailsView from './views/UserDetails.view';
import UserEditView from './views/UserEdit.view';
import UserListView from './views/UserList.view';

export default function Routes() {
  useEffect(() => {
    window.onunhandledrejection = ({ reason }) => {
      if (reason instanceof CustomError) {
        if (reason.data?.objects) {
          reason.data.objects.forEach((error) => {
            message.error(error.userMessage);
          });
        } else {
          notification.error({
            message: reason.message,
            description:
              reason.data?.detail === 'Network Error'
                ? 'Erro na rede'
                : reason.data?.detail,
          });
        }
      } else {
        notification.error({
          message: 'Houve um erro',
        });
      }
    };

    return () => {
      window.onunhandledrejection = null;
    };
  }, []);
  return (
    <Switch>
      <Route path={'/'} exact component={HomeView} />
      <Route path={'/usuarios/cadastro'} exact component={UserCreateView} />
      <Route path={'/usuarios/edicao/:id'} exact component={UserEditView} />
      <Route path={'/usuarios/:id'} exact component={UserDetailsView} />
      <Route path={'/usuarios'} exact component={UserListView} />
      <Route path={'/pagamentos'} exact component={PaymentListView} />
      <Route
        path={'/pagamentos/cadastro'}
        exact
        component={PaymentCreateView}
      />
      <Route path={'/pagamentos/:id'} exact component={PaymentDetailsView} />
      <Route
        path={'/fluxo-de-caixa/despesas'}
        exact
        component={CashFlowExpensesView}
      />
      <Route
        path={'/fluxo-de-caixa/receitas'}
        exact
        component={CashFlowRevenuesView}
      />
    </Switch>
  );
}
