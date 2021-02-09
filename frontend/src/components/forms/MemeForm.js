import React, { useContext } from "react";
import axios from "axios";
import { useState } from "react";
import { MemeContext } from "../../context/MemeContext";
import { TextField, Button, makeStyles, Grid } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

export default function MemeForm(props) {
  const { meme, like, dislike } = useContext(MemeContext);
  const [memes, setMemes] = meme;
  const [likes, setLikes] = like;
  const [dislikes, setDislikes] = dislike;
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const { afterSubmit } = props;

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      await axios.get(url, { crossdomain: true });
      const data = await axios.post("/memes", { name, url, caption });
      const list = await axios.get("/memes");
      const likeData = await axios.get("/memes/likes");
      const dislikeData = await axios.get("/memes/dislikes");  
      setMemes(list.data);
      setLikes(likeData.data);
      setDislikes(dislikeData.data);
      setName("");
      setUrl("");
      setCaption("");
      afterSubmit();
    } catch (e) {
      if (e.message === "Network Error") {
        failure("Invalid Image URL due to CORS Policy");
      } else if (e.response.status === 404) {
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
            onChange={(e) => setName(e.target.value)}
            required
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
          Submit
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
}
