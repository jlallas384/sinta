import { Link } from "react-router";
import logo from "../assets/logo.svg";

function Welcome() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col py-11 items-center max-w-xl gap-5">
        <h1 className="text-white text-3xl font-bold inline-block">
          Hello PUPian!
        </h1>

        <img src={logo} width={200} />

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-white text-2xl font-bold">
            HANAP SINTA
          </h1>
          <p className="italic text-yellow-300 text-center">
            PUP Sta. Mesa Exclusive Digital Path Finder
          </p>
        </div>

        <div className="flex flex-col w-full gap-3">
          <p className="text-white text-xs">Choose Feature:</p>

          <Link to="/find-route" className="bg-yellow-300 text-center py-1.5 rounded-md font-semibold border-black border hover:bg-yellow-400">Shortest Route</Link>

          <Link to="/emergency-route" className="bg-yellow-300 text-center py-1.5 rounded-md font-semibold border-black border hover:bg-yellow-400">Emergency Route</Link>

          
          <Link to="/lost-and-found" className="bg-yellow-300 text-center py-1.5 rounded-md font-semibold border-black border hover:bg-yellow-400">Lost and Found</Link>
        </div>

      </div>
    </div>
  );
}

export default Welcome;
