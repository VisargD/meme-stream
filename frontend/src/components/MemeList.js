import React, { useContext, useState } from "react";
import MemeForm from "./MemeForm";
import { MemeContext } from "../context/MemeContext";
import axios from "axios";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Popup from "./controls/Popup";

export default function MemeList() {
  const [memes, setMemes] = useContext(MemeContext);
  const [openPopup, setOpenPopup] = useState(false);

  const deleteHandler = async (id) => {
    await axios.delete("/memes/" + id);
    const data = await axios.get("/memes");
    setMemes(data.data);
  };

  const afterSubmit = () => {
    setOpenPopup(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpenPopup(true)}
      >
        Add Meme
      </Button>

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
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} title="Add Meme">
        {" "}
        <MemeForm afterSubmit={afterSubmit} />{" "}
      </Popup>
    </div>
  );
}
