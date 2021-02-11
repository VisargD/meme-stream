import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const MemeContext = createContext();

export const MemeProvider = (props) => {
  const [memes, setMemes] = useState([]);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(async () => {
    const data = await axios.get("/memes");
    const likeData = await axios.get("/likes");
    const dislikeData = await axios.get("/dislikes"); 
    const commentsData = await axios.get("/comments");   
    setMemes(data.data);
    setLikes(likeData.data);
    setDislikes(dislikeData.data);
    setComments(commentsData.data);
  }, []);

  
  
  return (
    <MemeContext.Provider
      value={{
        meme: [memes, setMemes],
        like: [likes, setLikes],
        dislike: [dislikes, setDislikes],
        comment: [comments, setComments],
      }}
    >
      {props.children}
    </MemeContext.Provider>
  );
};
