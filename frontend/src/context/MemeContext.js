import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const MemeContext = createContext();

export const MemeProvider = (props) => {
  const [memes, setMemes] = useState([]);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);

  useEffect(async () => {
    const data = await axios.get("/memes");
    const likeData = await axios.get("/memes/likes");
    const dislikeData = await axios.get("/memes/dislikes");    
    setMemes(data.data);
    setLikes(likeData.data);
    setDislikes(dislikeData.data);
  }, []);

  
  
  return (
    <MemeContext.Provider
      value={{
        meme: [memes, setMemes],
        like: [likes, setLikes],
        dislike: [dislikes, setDislikes],
      }}
    >
      {props.children}
    </MemeContext.Provider>
  );
};
