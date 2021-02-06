import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MemeList(props) {
  const [memes, setMemes] = useState([]);

  useEffect(async () => {
    const data = await axios.get("/memes");
    setMemes(data.data);
  }, []);

  return (
    <div>
      {memes.map((meme) => {
        return (
          <>
            <h2>{meme.name}</h2>
            <h3>{meme.caption}</h3>
            <img class='meme-image' src={meme.url} />
          </>
        );
      })}
    </div>
  );
}
