import { LocaleProvider } from "./context/LocaleContext";
import { ThemeColorProvider } from "./context/ThemeColorContext";
import { ThemeProvider } from "./context/themeContext";
import "./globals.css";
import NextAuthProvider from "./Providers/NextAuthProvider";

// import { Quicksand, Tajawal } from "next/font/google";

// const quicksand = Quicksand({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-quicksand",
//   display: "swap",
// });

// const tajawal = Tajawal({
//   subsets: ["arabic"],
//   weight: ["400", "500", "700", "800"],
//   variable: "--font-tajawal",
//   display: "swap",
// });

export const metadata = {
  title: 'سينكو',
  description: 'موقع للمذاكرة والتعلم',
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 antialiased">
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
