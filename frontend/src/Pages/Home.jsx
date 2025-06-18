
const Home = () => {
    const navigateToFiles = () => {
        window.location.href = '/get-all-files';
    };
    const navigateToSummary = () => {
        window.location.href = '/get-summary';
    };
  return (
      <div className="bg-gray-200 min-h-screen flex items-center justify-center w-full">
          <div className="text-center">
              <div className="flex flex-col items-center">
                  <h1 className="text-3xl font-bold m-10 text-gray-800">Text Extraction App</h1>
                  <div className="flex flex-row gap-5">
                      <button className="bg-black text-white p-3 text-2xl rounded-2xl shadow-[0_5px_5px_#000000] font-bold hover:cursor-pointer hover:animate-pulse"
                          onClick={navigateToFiles}>All Notes</button>
                      <button className="bg-white text-black p-3 text-2xl rounded-2xl shadow-[0_5px_5px_#000000] font-bold hover:cursor-pointer hover:animate-pulse"
                          onClick={navigateToSummary}>Get Summary</button>
                  </div>

              </div>

          </div>

      </div>
  )
}

export default Home