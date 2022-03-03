import { Route, Switch, useHistory } from 'react-router-dom';

import HomeView from './views/Home.view';
import UserCreateView from './views/UserCreate.view';
import UserEditView from './views/UserEdit.view';
import UserListView from './views/UserList.view';
import UserDetailsView from './views/UserDetails.view';
import PaymentListView from './views/PaymentList.view';
import PaymentCreateView from './views/PaymentCreate.view';
import PaymentDetailsView from './views/PaymentDetails.view';
import CashFlowRevenuesView from './views/CashFlowRevenues.view';
import CashFlowExpensesView from './views/CashFlowExpenses.view';
import { useEffect } from 'react';
import CustomError from 'vitorpmaringolo-sdk/dist/CustomError';
import { message, notification } from 'antd';
import AuthService from '../auth/Authorization.service';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../core/store/Auth.slice';
import jwtDecode from 'jwt-decode';
import { Authentication } from '../auth/Auth';

export default function Routes() {
  const history = useHistory();
  const dispatch = useDispatch();

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
        reason.data?.objects?.forEach((object: { userMessage: string }) => {
          message.error(object.userMessage);
        });

        notification.error({
          message: reason?.message || 'Houve um erro',
        });
      }
    };

    return () => {
      window.onunhandledrejection = null;
    };
  }, []);

  useEffect(() => {
    async function identify() {
      const isInAuthorizationRoute = window.location.pathname === '/authorize';
      const code = new URLSearchParams(window.location.search).get('code');

      const codeVerifier = AuthService.getCodeVerifier();
      const accessToken = AuthService.getAccessToken();

      if (!accessToken && !isInAuthorizationRoute) {
        AuthService.imperativelySendToLoginScreen();
      }

      if (isInAuthorizationRoute) {
        if (!code) {
          notification.error({
            message: 'Código não foi informado',
          });
          return;
        }

        if (!codeVerifier) {
          // necessário fazer logout
          return;
        }

        // busca o primeiro token de acesso
        const { access_token, refresh_token } =
          await AuthService.getFirstAccessToken({
            code,
            codeVerifier,
            redirectUri: 'http://localhost:3000/authorize',
          });

        AuthService.setAccessToken(access_token);
        AuthService.setRefreshToken(refresh_token);

        history.push('/');
      }

      if (accessToken) {
        const decodedToken: Authentication.AccessTokenDecodedBody =
          jwtDecode(accessToken);
        dispatch(fetchUser(decodedToken['alganews:user_id']));
      }
    }

    identify();
  }, [dispatch, history]);

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
