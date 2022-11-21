import React, { useEffect, useState } from "react";
import Card from "./Card";
import { getcharacters } from "../Services/Services";
import backgroundImage from "../assets/rick.jpg";

const Tabs = ({
  color,
  filterData,
  characters,
  setCharacters,
  setShowFilters,
}) => {
  const [openTab, setOpenTab] = useState(1);
  const [search, setSearch] = useState("");
  let width = window.innerWidth;
  console.log(characters, "cefwsvfzszv");

  let chars = characters;

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search.length > 0) {
      let char = characters?.filter((character) => {
        return character.name.toLowerCase().match(search);
      });
      setCharacters(char);
    } else {
      getcharacters().then((res) => {
        setCharacters(res.data.data.results);
      });
    }
  }, [search]);

  return (
    <>
      <div className="flex flex-wrap">
        <ul
          className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row ml-6"
          role="tablist"
        >
          <li className="flex-auto text-center mr-6 text-orange-400 border-b-2 border-orange-400">
            <a
              className="text-xs font-bold uppercase p-2 rounded block leading-normal"
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(1);
              }}
              data-toggle="tab"
              href="#link1"
              role="tablist"
            >
              Talent
            </a>
          </li>
          <li className="flex-auto text-center mr-6 text-gray-400">
            <a
              className="text-xs font-bold capitalize p-2 rounded block leading-normal"
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(2);
              }}
              data-toggle="tab"
              href="#link2"
              role="tablist"
            >
              Tribes
            </a>
          </li>
          <li className="flex-auto text-center mr-6 text-gray-400">
            <a
              className="text-xs font-bold capitalize p-2 rounded block leading-normal"
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(3);
              }}
              data-toggle="tab"
              href="#link3"
              role="tablist"
            >
              Clients
            </a>
          </li>
          <li className="flex-auto text-center text-gray-400">
            <a
              className="text-xs font-bold capitalize p-2 rounded block leading-normal "
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(3);
              }}
              data-toggle="tab"
              href="#link3"
              role="tablist"
            >
              Projects
            </a>
          </li>
        </ul>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
          <div className="flex-auto">
            <div className="tab-content tab-space">
              <div
                className={
                  openTab === 1
                    ? "block bg-gray-100 h-full px-6 py-4"
                    : "hidden"
                }
                id="link1"
              >
                <input
                  type="text"
                  id="email"
                  class="bg-white border border-gray-300 text-black text-sm rounded-lg focus:Class
                  Properties
                  outline-none w-full p-2.5  "
                  placeholder="Search"
                  onChange={(e) => handleInput(e)}
                />
                <div className="flex flex-wrap py-2 w-full">
                  {characters &&
                    characters?.map((data, index) => {
                      return (
                        <div
                          className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3"
                          key={data.id}
                        >
                          <Card
                            name={data.name}
                            gender={data.gender}
                            species={data.species}
                            image={data.image}
                            status={data.status}
                            location={data.location.name}
                            backgroundImage={backgroundImage}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                <p>
                  Completely synergize resource taxing relationships via premier
                  niche markets. Professionally cultivate one-to-one customer
                  service with robust ideas.
                  <br />
                  <br />
                  Dynamically innovate resource-leveling customer service for
                  state of the art customer service.
                </p>
              </div>
              <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                <p>
                  Efficiently unleash cross-media information without
                  cross-media value. Quickly maximize timely deliverables for
                  real-time schemas.
                  <br />
                  <br /> Dramatically maintain clicks-and-mortar solutions
                  without functional solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs;
