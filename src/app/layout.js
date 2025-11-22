import "./globals.css";

export const metadata = {
  title: "Dark Mode To-Do / Grocery List",
  description: "Modern dark-themed grocery and task list app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100">{children}</body>
    </html>
  );
}
