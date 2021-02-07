import React, { useContext } from "react";
import MemeForm from "./MemeForm";
import { MemeContext } from "../context/MemeContext";

export default function MemeList() {
  const [memes, setMemes] = useContext(MemeContext);

  return (
    <div>
      <MemeForm />
      {memes.map((meme) => {
        return (
          <>
            <h2>{meme.name}</h2>
            <h3>{meme.caption}</h3>
            <img class="meme-image" src={meme.url} />
          </>
        );
      })}
    </div>
  );
}
