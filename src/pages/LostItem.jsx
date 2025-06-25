import { Link, useParams } from "react-router";
import Map from "../components/Map";
import { useEffect, useState } from "react";


function LostItem() {
  const params = useParams()

  const [data, setData] = useState({})

  useEffect(() => {
    async function loadData() {
      const response = await fetch(`/api/lost/${params.itemid}`)
      const json = await response.json()
      setData(json)
    }

    loadData()
  }, [])
  return (
    <div className="flex flex-col" style={{ height: "90vh" }}>
      <div className="py-5 px-5 w-full max-w-xl self-center">
        <Link to="/lost">
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
      <div className="flex flex-col items-center w-full max-w-xl mx-auto gap-10">
        <div className="flex flex-col w-6/12 items-center gap-2">
          <img src={data.imageData} className="border-white shadow-lg border rounded-lg"/>
        </div>

        <div className="flex flex-col items-center gap-5 w-full">
          <h1 className="text-white text-lg mt-3 text-center ">
          Name of Guard: {data.guardName}
          </h1>

          <Link
            to="navigate"
            className="w-10/12 bg-yellow-300 text-center py-5 rounded-md font-semibold border-black border hover:bg-yellow-400"
          >
            Navigate
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LostItem;
