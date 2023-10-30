import "./globals.css";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { AuthProvider } from "@/context/AuthContext";
export const metadata = {
  title: "Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <AuthProvider>{children}</AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
