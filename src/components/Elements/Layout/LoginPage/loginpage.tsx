import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: "url('/home-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative bg-white w-[817px] h-[498px] rounded-[45px] flex flex-col p-[27px] z-10">

        <div className="flex items-center w-[159px] h-[42px] rounded-[8px] mb-6">
          <div
            className="w-[32px] h-[32px] rounded-[8px] bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: "url('/logo.png')" }}
          ></div>
          <h1 className="text-black text-lg ml-3 font-bold">
            RPL FINAL
          </h1>
        </div>
        
        <div className="w-[378px] h-[350px] rounded-2xl mx-auto">
            <h1 className="text-4xl font-bold">Log In</h1>
            <div className="bg-[white] w-[378px] h-[196px] mt-[20px]">
                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300"/>
                    <label htmlFor="password" className="mt-[15px]">Password</label>
                    <input type="password" id="password" className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300"/>
                    <Link href="/auth/forgot" className="text-blue-500 mt-[10px]">
                        Lupa Password?
                    </Link>
                </div>

                <div className="flex justify-end mt-[10px]">
                    <button className="bg-blue-400 font-bold text-white rounded-md w-[77px] h-[40px]">
                        Masuk
                    </button>                    
                </div>

                <div className="flex justify-center items-center gap-2 mt-[30px]">
                    <p className="text-sm text-gray-700">Belum memiliki akun?</p>
                    <Link href="/auth/register" className="text-sm text-blue-500 font-semibold hover:underline">
                        Daftar sekarang
                    </Link>
                </div>
            </div>
        </div>        
      </div>
    </div>
  );
}
