import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const MemeContext = createContext();

export const MemeProvider = (props) => {
  const [memes, setMemes] = useState([]);

  useEffect(async () => {
    const data = await axios.get("/memes");
    setMemes(data.data);
  }, []);

  return (
    <MemeContext.Provider value={[memes, setMemes]}>
      {props.children}
    </MemeContext.Provider>
  );
};
