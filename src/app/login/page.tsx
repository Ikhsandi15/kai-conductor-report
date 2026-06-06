import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role === "ADMIN") {
      redirect("/reports");
    } else {
      redirect("/reports/new");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-800">KAI Laporan</h2>
          <p className="text-gray-500 mt-2">Login untuk masuk ke sistem</p>
        </div>
        
        <LoginForm />

        <div className="mt-8 border-t pt-6">
          <p className="text-sm text-gray-600 mb-2 font-semibold">Gunakan akun mock berikut untuk demo:</p>
          <div className="bg-gray-100 p-3 rounded text-xs space-y-2">
            <div>
              <span className="font-bold text-blue-700">Admin (Mas Tiko)</span><br/>
              Email: <code className="bg-white px-1">admin@kai.id</code><br/>
              Pass: <code className="bg-white px-1">admin123</code>
            </div>
            <div>
              <span className="font-bold text-blue-700">Kondektur (Budi)</span><br/>
              Email: <code className="bg-white px-1">budi@kai.id</code><br/>
              Pass: <code className="bg-white px-1">kondektur123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
