"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { fetchJson } from "@/lib/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetchJson("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    redirect_to: "http://localhost:3000/auth/reset-password"
                }),
            });

            if (res.success) {
                setSuccess("Link reset password telah dikirim ke email Anda.");
            } else {
                setSuccess(res.message || "Link reset password telah dikirim ke email Anda.");
            }

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

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password?</h1>
                        <p className="text-sm text-gray-600">
                            Masukkan email Anda untuk menerima link reset password.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="nama@email.com"
                        />
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
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Kirim Link Reset"
                        )}
                    </button>

                    <div className="flex justify-center items-center gap-2 text-sm mt-2">
                        <Link
                            href="/auth/login"
                            className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-2"
                        >
                            <i className="bi bi-arrow-left"></i>
                            Kembali ke Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
