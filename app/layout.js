import { Bangers } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
});

export const metadata = {
  title: "Liga Batcarallo",
  description: "Liga privada de fantasy fútbol - Biwenger",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${bangers.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gotham text-gotham-text">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
