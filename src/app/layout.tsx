'use client';
import { Provider } from 'react-redux';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { store } from '@/store';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <StyledComponentsRegistry>
          <Provider store={store}>{children}</Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
