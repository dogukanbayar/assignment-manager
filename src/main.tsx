import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { seedDemoData } from './api/fakeServer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { I18nProvider } from './i18n/I18nProvider';
import { store } from './store/store';
import { ThemeModeProvider } from './theme/ThemeModeProvider';

seedDemoData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <I18nProvider>
          <ThemeModeProvider>
            <App />
          </ThemeModeProvider>
        </I18nProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);
