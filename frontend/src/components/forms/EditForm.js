import React, { useContext } from "react";
import axios from "axios";
import { useState } from "react";
import { MemeContext } from "../../context/MemeContext";
import { TextField, Button, makeStyles, Grid } from "@material-ui/core";
import { failure } from "../controls/toast";

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
  const { afterSubmit, editItem } = props;
  const { meme } = useContext(MemeContext);
  const [memes, setMemes] = meme;
  const [name, setName] = useState(editItem.name);
  const [url, setUrl] = useState(editItem.url);
  const [caption, setCaption] = useState(editItem.caption);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const data = await axios.patch("/memes/" + editItem.id, { url, caption });
      const list = await axios.get("/memes");
      setMemes(list.data);
      setName("");
      setUrl("");
      setCaption("");
      afterSubmit();
    } catch (e) {
      if (e.response.status === 404) {
        failure("Invalid Image URL");
      } else {
        failure("Duplicate Post");
      }
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
        <h2>Image Preview: </h2>
        <img src={url} style={{ width: "100%", height: "auto" }} />
      </form>
    </div>
  );
}
