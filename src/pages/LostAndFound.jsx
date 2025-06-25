import { Link } from "react-router";

function LostAndFound() {
  return (
    <div className="flex flex-col items-center">
      <div className="py-5 px-5 w-full max-w-xl">
        <Link to="/features">
          <svg
            width="14"
            height="22"
            viewBox="0 0 14 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3333 21.8333L0.5 11L11.3333 0.166664L13.2562 2.08958L4.34583 11L13.2562 19.9104L11.3333 21.8333Z"
              fill="white"
            />
          </svg>
        </Link>
      </div>
      <div className="flex flex-col py-11 items-center max-w-xl gap-20 mt-3">


        <h1 className="text-white text-3xl font-bold inline-block">
          Lost And Found
        </h1>

        <div className="flex flex-col w-full gap-3">
          <Link
            to="/lost"
            className="w-full bg-yellow-300 text-center py-5 rounded-md font-semibold border-black border hover:bg-yellow-400"
          >
            I Lost Something
          </Link>
          <Link
            to="/found"
            className="w-full bg-yellow-300 text-center py-5 rounded-md font-semibold border-black border hover:bg-yellow-400"
          >
            I Found Something
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LostAndFound;
