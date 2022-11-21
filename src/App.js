import Sidebar from "./components/Sidebar";
import logo from "./logo.svg";
import { MicrophoneIcon } from "@heroicons/react/solid";
import { StarIcon } from "@heroicons/react/outline";
import Tabs from "./components/Tabs";
import React, { useEffect, useState, useCallback, useReducer } from "react";
import { getcharacters } from "./Services/Services";
import useWindowDimensions from "./utils/getWindowDimension";

let originalData = new Map();

function reducer(state, action) {
  switch (action.type) {
    case "set-data":
      return { ...state, data: action.payload };
    case "filter-data":
      let data = new Map();
      let characterData = Array.from(originalData, ([id, value]) => value);
      const filters = action.payload;

      if (
        filters.species.length === 0 &&
        filters.status.length === 0 &&
        filters.gender.length === 0 &&
        filters.location.length === 0
      ) {
        return { ...state, data: characterData };
      }
      for (const character of characterData) {
        if (
          filters.species.length > 0 &&
          filters.species.includes(character.species)
        ) {
          data.set(character.id, character);
        }
        if (
          filters.status.length > 0 &&
          filters.status.includes(character.status)
        ) {
          data.set(character.id, character);
        }
        if (
          filters.gender.length > 0 &&
          filters.gender.includes(character.gender)
        ) {
          data.set(character.id, character);
        }
        if (
          filters.location.length > 0 &&
          filters.location.includes(character.location.name)
        ) {
          data.set(character.id, character);
        }
      }
      return { ...state, data: Array.from(data, ([id, value]) => value) };
    case "clear-filter":
      return {
        ...state,
        data: Array.from(originalData, ([id, value]) => value),
      };
    default:
      throw new Error();
  }
}

function filterReducer(state, action) {
  switch (action.type) {
    case "add-species":
      return { ...state, species: [...state.species, action.payload] };
    case "remove-species":
      return {
        ...state,
        species: state.species.filter((item) => item !== action.payload),
      };
    case "add-status":
      return { ...state, status: [...state.status, action.payload] };
    case "remove-status":
      return {
        ...state,
        status: state.status.filter((item) => item !== action.payload),
      };
    case "add-gender":
      return { ...state, gender: [...state.gender, action.payload] };
    case "remove-gender":
      return {
        ...state,
        gender: state.gender.filter((item) => item !== action.payload),
      };
    case "add-location":
      return { ...state, location: [...state.location, action.payload] };
    case "remove-location":
      return {
        ...state,
        location: state.location.filter((item) => item !== action.payload),
      };
    default:
      throw new Error();
  }
}

function App() {
  const [filterData, filterDispatch] = useReducer(filterReducer, {
    species: [],
    status: [],
    gender: [],
    location: [],
    rating: -1,
  });
  const { width } = useWindowDimensions();
  const [characters, charactersDispatch] = useReducer(reducer, {});

  const [nextPageUrl, setNextPageUrl] = useState("");
  const [prevPageUrl, setPrevPageUrl] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);
  const [sidebarButton, setSidebarButton] = useState(true);
  const [isChecked, setIsChecked] = useState(null);
  const [filterIcon, setFilterIcon] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    if (width < 768) {
      setShowFilters(false);
      setFilterIcon(true);
      setSidebarButton(false);
    } else {
      setShowFilters(true);
      setFilterIcon(false);
      setSidebarButton(true);
    }
  }, [width]);

  useEffect(() => {
    getcharacters().then((res) => {
      console.log(res, "http://localhost:5000/api/v1/character");
      charactersDispatch({ type: "set-data", payload: res.data.data.results });
      for (const character of res.data.data.results) {
        originalData.set(character.id, character);
      }
      setNextPageUrl(res.data.info.next);
      setPrevPageUrl(res.data.info.prev);
    });
  }, []);

  const handleStatus = (event) => {
    if (event.target.checked) {
      filterDispatch({ type: "add-status", payload: event.target.value });
    } else {
      filterDispatch({ type: "remove-status", payload: event.target.value });
    }
  };

  const handleSpecies = (event) => {
    if (event.target.checked) {
      filterDispatch({ type: "add-species", payload: event.target.value });
    } else {
      filterDispatch({ type: "remove-species", payload: event.target.value });
      charactersDispatch({ type: "clear-filter" });
    }
  };

  const handleGender = (event) => {
    if (event.target.checked) {
      filterDispatch({ type: "add-gender", payload: event.target.value });
    } else {
      filterDispatch({ type: "remove-gender", payload: event.target.value });
      charactersDispatch({ type: "clear-filter" });
    }
  };

  const handleLocation = (event) => {
    if (event.target.checked) {
      filterDispatch({ type: "add-location", payload: event.target.value });
    } else {
      filterDispatch({ type: "remove-location", payload: event.target.value });
      charactersDispatch({ type: "clear-filter" });
    }
  };

  const onFilter = () => {
    charactersDispatch({ type: "filter-data", payload: filterData });
  };

  const onClear = () => {
    setIsChecked(false);
    charactersDispatch({ type: "clear-filter" });
  };
  useEffect(() => {
    setIsChecked(null);
  }, [isChecked]);

  return (
    <div class="relative md:flex" data-dev-hint="container">
      <input type="checkbox" id="menu-open" class="hidden" />

      <label
        for="menu-open"
        class="absolute right-2 bottom-2 shadow-lg rounded-full p-2 bg-gray-100 text-gray-600 md:hidden"
        data-dev-hint="floating action button"
      >
        <svg
          class="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </label>

      <header
        class="bg-gray-600 text-gray-100 flex justify-between md:hidden"
        data-dev-hint="mobile menu bar"
      >
        <a
          href="#"
          class="block p-4 text-white font-bold whitespace-nowrap truncate"
        >
          Cool
        </a>

        <label
          for="menu-open"
          id="mobile-menu-button"
          class="m-2 p-2 focus:outline-none hover:text-white hover:bg-gray-700 rounded-md"
        >
          <svg
            id="menu-open-icon"
            class="h-6 w-6 transition duration-200 ease-in-out"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            id="menu-close-icon"
            class="h-6 w-6 transition duration-200 ease-in-out"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </label>
      </header>

      {openSidebar && (
        <aside
          id="sidebar"
          class="bg-gray-800 text-gray-100 md:w-64 w-3/4 space-y-6 pt-6 px-0 top-0 inset-y-0 left-0 transform md:relative md:translate-x-[-200px] transition duration-200 ease-in-out hidden  md:flex md:flex-col md:justify-between"
          data-dev-hint="sidebar; px-0 for frameless; px-2 for visually inset the navigation"
        >
          <div
            class="flex flex-col space-y-6"
            data-dev-hint="optional div for having an extra footer navigation"
          >
            <a
              href="#"
              class="text-white flex items-center space-x-2 px-4"
              title="Cool"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 flex-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <span class="text-2xl font-extrabold whitespace-nowrap truncate">
                SideBar
              </span>
            </a>

            <nav data-dev-hint="main navigation">
              <a
                href="#"
                class="flex items-center space-x-2 py-4 px-4 transition duration-200 hover:bg-gray-700 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>

                <span>Discovery</span>
              </a>
              <a
                href="#"
                class=" flex items-center space-x-2 py-4 px-4 transition duration-200 hover:bg-gray-700 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>

                <span>Build a Tribe</span>
              </a>
              <a
                href="#"
                class="flex items-center space-x-2 py-4 px-4 transition duration-200 hover:bg-gray-700 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
                <span>My Tribe</span>
              </a>
              <a
                href="#"
                class="flex items-center space-x-2 py-4 px-4 transition duration-200 hover:bg-gray-700 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>

                <span>My Proposals</span>
              </a>
              <a
                href="#"
                class="flex items-center space-x-2 py-4 px-4 transition duration-200 hover:bg-gray-700 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>

                <span>My Projects</span>
              </a>
            </nav>
          </div>
        </aside>
      )}

      <main id="content" class="flex-1 ">
        <div class="max-w-7xl mx-auto bg-gray-100">
          <div class="px-4 py-2  sm:px-0 min-h-24 block bg-orange-400"></div>
          <div className="block md:flex w-full p-4 relative">
            <div
              className={`absolute left-[-16px] ${
                openSidebar ? "rotate-180" : ""
              }`}
            >
              {sidebarButton && (
                <div
                  onClick={() => setOpenSidebar(!openSidebar)}
                  className="w-[37px] h-[37px] rounded-full cursor-pointer flex justify-center items-center bg-orange-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 font-bold"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div
              className="mb-4 cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}
            >
              {filterIcon && (
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 mr-2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                  <h4>Filter</h4>
                </div>
              )}
            </div>
            <div className="w-full md:w-3/12 p-2">
              <div
                className={`justify-between flex-row md:flex-col h-auto md:h-full static md:fixed z-99 top-[0%] pt-0 md:pt-14 pb-4 overflow-x-hidden ${
                  showFilters ? "flex" : "hidden"
                }`}
              >
                <div>
                  <h1 className="text-2xl font-semibold mb-2">Filters</h1>
                  <div className="flex flex-col">
                    <h1 className="text-lg font-semibold mb-2">Pods</h1>
                    <div class="flex items-center mb-1">
                      <input
                        id="species-human"
                        type="checkbox"
                        checked={isChecked}
                        value="Human"
                        name="species"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:ring-offset-gray-800"
                        onChange={handleSpecies}
                      />
                      <label
                        for="species-human"
                        className="ml-2 text-sm font-medium text-gray-500"
                      >
                        Human
                      </label>
                    </div>
                    <div className="flex items-center mb-1">
                      <input
                        id="species-alien"
                        type="checkbox"
                        checked={isChecked}
                        value="Alien"
                        name="species"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:ring-offset-gray-800"
                        onChange={handleSpecies}
                      />
                      <label
                        for="species-alien"
                        className="ml-2 text-sm font-medium text-gray-500"
                      >
                        Alien
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-lg font-semibold mb-2">Status</h1>
                    <div class="flex items-center mb-1">
                      <input
                        id="status-alive"
                        type="checkbox"
                        checked={isChecked}
                        value="Alive"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:ring-offset-gray-800"
                        onChange={handleStatus}
                      />
                      <label
                        for="status-alive"
                        className="ml-2 text-sm font-medium text-gray-500"
                      >
                        Alive
                      </label>
                    </div>
                    <div className="flex items-center mb-1">
                      <input
                        id="status-dead"
                        type="checkbox"
                        checked={isChecked}
                        value="Dead"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:ring-offset-gray-800"
                        onChange={handleStatus}
                      />
                      <label
                        for="status-dead"
                        className="ml-2 text-sm font-medium text-gray-500"
                      >
                        Dead
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <h1 className="text-lg font-semibold mb-2">Gender</h1>
                    <div class="flex items-center mb-1">
                      <input
                        id="gender-male"
                        type="checkbox"
                        value="Male"
                        checked={isChecked}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:ring-offset-gray-800"
                        onChange={handleGender}
                      />
                      <label
                        for="gender-male"
                        className="ml-2 text-sm font-medium text-gray-500"
                      >
                        Male
                      </label>
                    </div>
                    <div className="flex items-center mb-1">
                      <input
                        id="gender-female"
                        type="checkbox"
                        checked={isChecked}
                        value="Female"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:ring-offset-gray-800"
                        onChange={handleGender}
                      />
                      <label
                        for="gender-female"
                        className="ml-2 text-sm font-medium text-gray-500"
                      >
                        Female
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-lg font-semibold mb-2">Location</h1>
                    <div class="flex items-center mb-1">
                      <input
                        id="location-citadel"
                        type="checkbox"
                        checked={isChecked}
                        value="Citadel of Ricks"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:ring-offset-gray-800"
                        onChange={handleLocation}
                      />
                      <label
                        for="location-citadel"
                        className="ml-2 text-sm font-medium text-gray-500"
                      >
                        Citadel of Ricks
                      </label>
                    </div>
                    <div className="flex items-center mb-1">
                      <input
                        id="location-earth"
                        type="checkbox"
                        checked={isChecked}
                        value="Earth (Replacement Dimension)"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:ring-offset-gray-800"
                        onChange={handleLocation}
                      />
                      <label
                        for="location-earth"
                        className="ml-2 text-sm font-medium text-gray-500"
                      >
                        Earth (Replacement Dimension)
                      </label>
                    </div>
                  </div>
                </div>
                <div className="my-2 text-center">
                  <button
                    className="bg-orange-400 rounded-full text-white font-semi-bold py-2 px-8 text-[14px]"
                    onClick={onFilter}
                  >
                    Apply Filters
                  </button>
                  <button
                    className="text-orange-600 font-semi-bold py-2 px-8 text-[14px]"
                    onClick={onClear}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full md:w-9/12 bg-white ">
              <h1 className="text-3xl font-bold p-4">Discovery</h1>
              <Tabs
                setShowFilters={setShowFilters}
                showFilters={showFilters}
                color="red"
                filterData={filterData}
                characters={characters.data}
                setCharacters={(data) =>
                  charactersDispatch({ type: "set-data", payload: data })
                }
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
