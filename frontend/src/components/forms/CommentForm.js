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

export default function CommentForm(props) {
  const { afterSubmit, commentItem } = props;
  const { meme } = useContext(MemeContext);
  const [memes, setMemes] = meme;
  const [name, setName] = useState("");
  const [commentValue, setCommentValue] = useState("");

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      await axios.put("/comments/" + commentItem.id, {
        name: name,
        comment: commentValue,
      });
      const data = await axios.get("/memes/all");
      setMemes(data.data);
      setName("");
      setCommentValue("");
      afterSubmit();
    } catch (e) {
      failure("Error!");
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
            name="name"
            label="Comment"
            variant="outlined"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            required
          />
        </Grid>

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>

        <h2>Comments:</h2>
        <List>
          {commentItem.comments
            ? commentItem.comments.map((item) => {
                return (
                  <>
                    <ListItem>
                      <ListItemText primary={item.name} />
                    </ListItem>
                    <ListItem>
                      <ListItemText secondary={item.comment} />
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
