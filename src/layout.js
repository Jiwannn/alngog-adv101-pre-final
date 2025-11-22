import "./globals.css";

export const metadata = {
  title: "Grocery App",
  description: "Modern grocery list in Next.js App Router",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
