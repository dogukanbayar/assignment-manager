import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from '../App';
import { I18nProvider } from '../i18n/I18nProvider';
import { makeStore } from '../store/store';
import { ThemeModeProvider } from '../theme/ThemeModeProvider';

export function renderApp(ui: ReactElement = <App />) {
  const store = makeStore();
  const user = userEvent.setup({ delay: null });
  const utils = render(
    <Provider store={store}>
      <I18nProvider initialLanguage="en">
        <ThemeModeProvider>{ui}</ThemeModeProvider>
      </I18nProvider>
    </Provider>,
  );
  return { user, store, ...utils };
}
