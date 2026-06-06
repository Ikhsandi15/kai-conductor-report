import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KAI Laporan Dinas",
  description: "Aplikasi Laporan Dinas Kondektur Kereta Api",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="id">
      <body className={`${jakarta.variable} font-sans antialiased bg-gray-50 min-h-screen text-gray-900`}>
        <nav className="bg-blue-700 text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold tracking-wider">KAI Laporan</Link>
            
            <div className="space-x-6 flex items-center">
              {session ? (
                <>
                  {/* CONDUCTOR CAN SEE THIS */}
                  {session.user.role === "CONDUCTOR" && (
                    <Link href="/reports/new" className="hover:text-blue-200 transition-colors font-medium">Buat Laporan</Link>
                  )}
                  
                  {/* ADMIN CAN SEE THESE */}
                  {session.user.role === "ADMIN" && (
                    <>
                      <Link href="/reports" className="hover:text-blue-200 transition-colors font-medium">Dashboard Rekap</Link>
                      <Link href="/trains" className="hover:text-blue-200 transition-colors font-medium">Master Kereta</Link>
                    </>
                  )}

                  <div className="border-l border-blue-500 pl-6 flex items-center gap-4">
                    <div className="text-sm text-blue-200 text-right">
                      <p className="font-bold text-white leading-tight">{session.user.name}</p>
                      <p className="text-xs">{session.user.role}</p>
                    </div>
                    <Link href="/api/auth/signout" className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded transition">Logout</Link>
                  </div>
                </>
              ) : (
                <Link href="/login" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-4 py-2 rounded transition">Login</Link>
              )}
            </div>
          </div>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
