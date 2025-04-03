import { LocaleProvider } from "./context/LocaleContext";
import { ThemeColorProvider } from "./context/ThemeColorContext";
import { ThemeProvider } from "./context/themeContext";
import "./globals.css";
import NextAuthProvider from "./Providers/NextAuthProvider";

export const metadata = {
  title: 'سينكو',
  description: 'موقع للمذاكرة والتعلم',
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <NextAuthProvider>
          <ThemeColorProvider>
            <ThemeProvider>
              <LocaleProvider>
                {children}
              </LocaleProvider>
            </ThemeProvider>
          </ThemeColorProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
