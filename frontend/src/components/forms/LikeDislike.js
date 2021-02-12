import React, { useContext } from "react";
import axios from "axios";
import { useState } from "react";
import { MemeContext } from "../../context/MemeContext";
import { TextField, Button, makeStyles, Grid } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { failure } from "../controls/toast";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const useStyle = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      margin: theme.spacing(1),
      width: "80%",
    },
    "& Button": {
      margin: theme.spacing(1),
    },
    "& .card": {
      margin: theme.spacing(1),
      padding: "0",
    },
  },
}));

export default function LikeDislike(props) {
  const { afterSubmit, likeDislikeItem, type } = props;
  const { meme } = useContext(MemeContext);
  const [memes, setMemes] = meme;
  const [name, setName] = useState("");

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (type === "like") {
        await axios.put("/likes/" + likeDislikeItem.id, { name });
      } else {
        await axios.put("/dislikes/" + likeDislikeItem.id, { name });
      }
      const data = await axios.get("/memes/all");
      setMemes(data.data);
      setName("");
      afterSubmit();
    } catch (e) {
      if (e.response.status === 403) {
        failure("Cannot be liked/disliked by the owner");
      } else if (type === "like") {
        failure("Already liked by user");
      } else {
        failure("Already disliked by user");
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
        </Grid>

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>

        {type === "like" ? <h2>Liked By:</h2> : <h2>Disliked By:</h2>}
        <List>
          {type === "like"
            ? likeDislikeItem.likes
              ? likeDislikeItem.likes.map((item) => {
                  return (
                    <>
                      <ListItem>
                        <ListItemText primary={item} />
                      </ListItem>
                      <Divider />
                    </>
                  );
                })
              : []
            : likeDislikeItem.dislikes
            ? likeDislikeItem.dislikes.map((item) => {
                return (
                  <>
                    <ListItem>
                      <ListItemText primary={item} />
                    </ListItem>
                    <Divider />
                  </>
                );
              })
            : []}
        </List>
      </form>
      <ToastContainer />
    </div>
  );
}
