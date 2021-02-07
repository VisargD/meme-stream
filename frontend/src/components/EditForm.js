import React, { useContext } from "react";
import axios from "axios";
import { useState } from "react";
import { MemeContext } from "../context/MemeContext";
import { TextField, Button, makeStyles, Grid } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      margin: theme.spacing(1),
      width: "80%",
    },
    "& Button": {
      margin: theme.spacing(1),
    },
  },
}));

export default function EditForm(props) {
  const { afterSubmit, editId, editName, editUrl, editCaption } = props;
  const [memes, setMemes] = useContext(MemeContext);
  const [name, setName] = useState(editName);
  const [url, setUrl] = useState(editUrl);
  const [caption, setCaption] = useState(editCaption);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const data = await axios.patch("/memes/" + editId, { url, caption });
      const list = await axios.get("/memes");
      setMemes(list.data);
      setName("");
      setUrl("");
      setCaption("");
      afterSubmit();
    } catch (e) {
      alert("The Post was deleted");
    }
  };

  const classes = useStyle();

  return (
    <div>
      <form className={classes.root} onSubmit={submitHandler}>
        <Grid>
          <TextField
            id="outlined-basic"
            name="name"
            label="Name"
            variant="outlined"
            value={name}
            readonly="readonly"
            disabled="disabled"
          />

          <TextField
            id="outlined-basic"
            name="url"
            label="URL"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <TextField
            id="outlined-basic"
            name="caption"
            label="Caption"
            variant="outlined"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
          />
        </Grid>

        <Button variant="contained" color="primary" type="submit">
          Edit
        </Button>
      </form>
    </div>
  );
}
