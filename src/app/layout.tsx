'use client';
import { Provider } from 'react-redux';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { store, persistor } from '@/store';
import { PersistGate } from 'redux-persist/integration/react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <StyledComponentsRegistry>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              {children}
            </PersistGate>
          </Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
