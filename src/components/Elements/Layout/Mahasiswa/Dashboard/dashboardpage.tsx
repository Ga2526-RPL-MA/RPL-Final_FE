export default function DashboardPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-blue-500 w-full max-w-[1800px] h-[80px] flex justify-center items-center">
        <div className="bg-red-500 w-[1400px] h-[40px] flex justify-center items-center relative">          
          <div className="absolute left-0 ml-6 flex justify-start items-center w-[159px] h-[42px] rounded-[8px]">
            <div
              className="w-[32px] h-[32px] rounded-[8px] bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: "url('/logo.png')" }}
            ></div>
            <h1 className="text-black text-lg ml-3 font-bold">
              RPL FINAL
            </h1>
          </div>
        </div>
      </div>
        <div className="bg-green-500 w-[300px] h-[944px]">

      </div>
    </div>
  );
}
