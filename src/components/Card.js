import { data } from "autoprefixer";
import React, { useEffect, useState } from "react";
import { getcharacters } from "../Services/Services";

function Card({ name, gender, image, status, species, backgroundImage }) {
  const [characters, setCharacters] = useState();

  return (
    <div className=" bg-white m-2 rounded-lg">
      <div className="w-full h-[190px] relative block justify-center rounded-t-lg">
        <img
          src={backgroundImage}
          className="w-full h-[140px] object-cover"
          alt=""
        />
        <div className="w-20 h-20 translate-y-[-2.5rem]  rounded-full bg-green-300 border-white border-2px-solid mx-auto">
          <img class="img-fluid rounded-full" src={image} alt="" />
        </div>
      </div>
      <div className="flex flex-col items-center pb-8 pl-4 pr-4">
        <div className="flex items-center">
          <div className="w-[8px] h-[8px] bg-green-500 rounded-full mt-2 mr-1"></div>
          <h4 className="text-[18px] font-bold text-gray-600 mt-2 mb-1">
            {name}
          </h4>
        </div>
        <div>
          <h4 className="text-red-400 font-bold text-[13px]">{species}</h4>
        </div>

        <p className="text-[13px] text-gray-500 mb-6 text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A corporis
          accusamus consectetur voluptatem saepe aliquam laboriosam aliquid quos
          itaque quae.
        </p>
        <button className="bg-violet-50 text-violet-500 text-[11px] py-2 px-3 font-bold">
          {status}
        </button>
      </div>
    </div>
  );
}

export default Card;
