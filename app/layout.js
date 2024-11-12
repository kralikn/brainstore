import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/utils/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Brain Store",
  description: "A BrainStore egy interaktív tudástár alkalmazás, ahol választhatsz témakörök között és kérdéseket tehetsz fel. Adminisztrátorok dokumentumokat tölthetnek fel, hogy létrehozzák a tudásbázist minden egyes témához. Powered by OpenAI API és Supabase.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
