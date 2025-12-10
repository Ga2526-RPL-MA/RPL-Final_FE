"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchJson } from "@/lib/api";


function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (token) {
        setAccessToken(token);

        document.cookie = `access_token=${token}; path=/; max-age=3600; SameSite=Lax`;
        if (refreshToken) {
          document.cookie = `refresh_token=${refreshToken}; path=/; max-age=3600; SameSite=Lax`;
        }
        console.log("ResetPassword: Tokens captured and cookies set.", { token: token.substring(0, 10) + "..." });
      } else {

        const queryParams = new URLSearchParams(window.location.search);
        const queryToken = queryParams.get("token");
        if (queryToken) {
          setAccessToken(queryToken);
          document.cookie = `access_token=${queryToken}; path=/; max-age=3600; SameSite=Lax`;
          console.log("ResetPassword: Token captured from Query.", { token: queryToken.substring(0, 10) + "..." });
        }
      }
    }
  }, []);

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama!");
      return;
    }

    if (!accessToken) {
      setError("Token tidak valid atau kadaluarsa. Silakan minta link reset baru.");
      return;
    }

    setLoading(true);

    try {


      const res = await fetchJson("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          password,

          refresh_token: getCookie("refresh_token"),

          access_token: accessToken
        }),
      });

      setSuccess("Password berhasil diubah! Anda akan dialihkan ke halaman login...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!accessToken) {

  }

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: "url('/home-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md p-8 z-10">
        <div className="flex items-center mb-8">
          <img
            src="/LogomyITS Final.png"
            alt="MyITS Final"
            className="h-[40px] object-contain"
          />
        </div>

        <form onSubmit={handleReset} className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-sm text-gray-600">
              Silakan masukkan password baru Anda.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex flex-col gap-2">
              <p className="text-red-600 text-sm">{error}</p>
              <Link href="/auth/forgot" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                Minta Link Baru
              </Link>
            </div>
          )}

          {!accessToken && !error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-700 text-sm">Memeriksa token...</p>
            </div>
          )}

          {accessToken && (
            <>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !accessToken}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Simpan Password"
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
