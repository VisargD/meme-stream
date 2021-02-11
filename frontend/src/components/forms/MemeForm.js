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
  const { meme, like, dislike, comment } = useContext(MemeContext);
  const [memes, setMemes] = meme;
  const [likes, setLikes] = like;
  const [dislikes, setDislikes] = dislike;
  const [comments, setComments] = comment;
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const { afterSubmit } = props;

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const data = await axios.post("/memes", { name, url, caption });
      const list = await axios.get("/memes");
      const likeData = await axios.get("/likes");
      const dislikeData = await axios.get("/dislikes");
      const commentData = await axios.get("/comments");
      setMemes(list.data);
      setLikes(likeData.data);
      setDislikes(dislikeData.data);
      setComments(commentData.data);
      setName("");
      setUrl("");
      setCaption("");
      afterSubmit();
    } catch (e) {
      if (e.response.status === 422) {
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
      <h2>Image Preview:</h2>
      <img src={url} style={{ width: "100%", height: "auto" }} />
      <ToastContainer />
    </div>
  );
}
