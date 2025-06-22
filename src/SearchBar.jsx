import { useState } from "react";

function SearchBar({ value, onChange, onResultClick}) {
  const [result, setResult] = useState([])
  console.log(result)
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-xl z-10">
      <div className="relative">
        <input
          value={value}
          onChange={(e) => {
            setResult(onChange(e.target.value))
          }}
          type="text"
          placeholder="Search..."
          className={`w-full h-12 px-5 pr-12 ${result.length && value ? "rounded-t-xl" : "rounded-full" } bg-white shadow-md focus:outline-none text-gray-700`}
        />
        {value && (
          <button
            onClick={() => {
              setResult(onChange(""));
            }}
            className="text-3xl absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        )}
      </div>

      {
        value && 
        result.map(({name, id}, i) => 
          <div className={`cursor-pointer w-full bg-white shadow-md px-5 py-3 ${i == result.length - 1 ? "rounded-b-xl" : ""}`} 
            onClick={() => {
              onResultClick(id)
            }} key={i}>
            { name }
          </div>
        )
      }
    </div>
  );
}

export default SearchBar;
