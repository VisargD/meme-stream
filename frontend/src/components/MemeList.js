import React, { useContext, useState } from "react";
import MemeForm from "./MemeForm";
import { MemeContext } from "../context/MemeContext";
import axios from "axios";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import Popup from "./controls/Popup";
import EditForm from "./EditForm";

export default function MemeList() {
  const [memes, setMemes] = useContext(MemeContext);
  const [openPopup, setOpenPopup] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCaption, setEditCaption] = useState("");

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
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => {
                setEditId(meme.id);
                setEditName(meme.name);
                setEditUrl(meme.url);
                setEditCaption(meme.caption);
                setOpenPopup(true);
              }}
            >
              Edit
            </Button>
          </>
        );
      })}
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} title="Add Meme">
        {" "}
        <MemeForm afterSubmit={afterSubmit} />{" "}
      </Popup>

      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        title="Edit Meme"
      >
        {" "}
        <EditForm
          afterSubmit={afterSubmit}
          editId={editId}
          editName={editName}
          editUrl={editUrl}
          editCaption={editCaption}
        />{" "}
      </Popup>
    </div>
  );
}
