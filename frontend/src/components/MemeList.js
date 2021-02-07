import React, { useContext } from "react";
import MemeForm from "./MemeForm";
import { MemeContext } from "../context/MemeContext";
import axios from "axios";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

export default function MemeList() {
  const [memes, setMemes] = useContext(MemeContext);

  const deleteHandler = async (id) => {
    await axios.delete("/memes/" + id);
    const data = await axios.get("/memes");
    setMemes(data.data);
  };
  return (
    <div>
      <MemeForm />
      {memes.map((meme) => {
        return (
          <>
            <h2>{meme.name}</h2>
            <h3>{meme.caption}</h3>
            <img class="meme-image" src={meme.url} />
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={() => deleteHandler(meme.id)}
            >
              Delete
            </Button>
          </>
        );
      })}
    </div>
  );
}
