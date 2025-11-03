import Link from "next/link";

export default function RegisterPage() {
    return (
        <div
            className="relative h-screen w-screen bg-cover bg-center flex justify-center items-center"
            style={{ backgroundImage: "url('/home-bg.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/80"></div>

            <div className="relative bg-white w-[700px] h-[750px] rounded-[45px] p-[27px] z-10">               
                <div className="flex items-center gap-3">
                    <div
                        className="w-[32px] h-[32px] rounded-[8px] bg-center bg-no-repeat bg-contain"
                        style={{ backgroundImage: "url('/logo.png')" }}
                    ></div>
                    <h1 className="text-black text-lg font-bold">
                        RPL FINAL
                    </h1>
                </div>

                <div className="w-[378px] h-[630px] mx-auto mt-[20px]">
                    <div className="text-4xl font-bold">Register</div>
                    <div className="flex flex-col w-[378px] h-[70ox]">
                        <label htmlFor="role" className="mt-[20px]">Peran</label>
                        <select id="role" className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300">
                            <option value="student">Mahasiswa</option>
                            <option value="teacher">Dosen</option>                            
                        /</select>

                        <label htmlFor="role" className="mt-[10px]">Nama</label>
                        <input type="name" id="name" className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300"/>
                        <label htmlFor="role" className="mt-[20px]">Email</label>
                        <input type="email" id="email" className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300"/>
                        <p className="text-sm text-gray-700 mt-[10px]">Email civitas akademika ITS</p>
                        <label htmlFor="password" className="mt-[20px]">Password</label>
                        <input type="password" id="password" className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300"/>
                        <label htmlFor="password" className="mt-[20px]">Konfirmasi Password</label>
                        <input type="password" id="password" className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300"/>
                        
                        <div className="flex justify-end mt-[20px]">
                            <button className="bg-blue-400 font-bold text-white rounded-md w-[77px] h-[40px]">
                                Daftar
                            </button>                    
                        </div>

                        <div className="flex justify-center items-center gap-2 mt-[20px]">
                            <p className="text-sm text-gray-700">Sudah memiliki akun?</p>
                            <Link href="/auth/login" className="text-sm text-blue-500 font-semibold hover:underline">
                                Masuk sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
