import axios, { Axios } from "axios";

export const getcharacters = () => {
  return axios.get(
    "http://localhost:5000/api/v1/character"
    //   : "https://rickandmortyapi.com/api/character/" + characterIds
  );
};
