import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextJS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div>Layout</div>
        {children}
      </body>
    </html>
  );
}
