import React, { useContext, useState } from "react";
import MemeForm from "../forms/MemeForm";
import { MemeContext } from "../../context/MemeContext";
import axios from "axios";
import Popup from "../controls/Popup";
import EditForm from "../forms/EditForm";
import LikeDislike from "../forms/LikeDislike";
import Appbar from "./Appbar";
import { makeStyles, Grid, Container } from "@material-ui/core";
import { failure, success } from "../controls/toast";
import { ToastContainer } from "react-toastify";
import MemePost from "./MemePost";
import CommentForm from "../forms/CommentForm";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

export default function MemeList() {
  const { meme } = useContext(MemeContext);
  const [memes, setMemes] = meme;
  const [openPopup, setOpenPopup] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [likeDislikeItem, setLikeDislikeItem] = useState({});
  const [commentItem, setCommentItem] = useState({});

  const classes = useStyles();
  const [formType, setFormType] = useState("");

  const deleteHandler = async (id) => {
    try {
      await axios.delete("/memes/" + id);
      const data = await axios.get("/memes/all");
      setMemes(data.data);
      success("Deleted Successfully");
    } catch (e) {
      failure("The post was already deleted");
    }
  };

  const afterSubmit = (msg) => {
    setOpenPopup(false);
    setFormType("");
    success(msg);
  };

  return (
    <div className={classes.root}>
      <Appbar
        onClick={() => {
          setFormType("add");
          setOpenPopup(true);
        }}
      />
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {memes.map((meme) => (
            <MemePost
              onDeleteClick={() => deleteHandler(meme.id)}
              memeItem={meme}
              onEditClick={() => {
                setEditItem(meme);
                setFormType("edit");
                setOpenPopup(true);
              }}
              onLikeClick={() => {
                setFormType("like");
                setOpenPopup(true);
                setLikeDislikeItem(meme);
              }}
              onDislikeClick={() => {
                setFormType("dislike");
                setOpenPopup(true);
                setLikeDislikeItem(meme);
              }}
              onCommentClick={() => {
                setFormType("comment");
                setOpenPopup(true);
                setCommentItem(meme);
              }}
            />
          ))}
        </Grid>
      </Container>

      {formType === "add" && (
        <Popup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          title="Add Meme"
        >
          {" "}
          <MemeForm
            afterSubmit={() => afterSubmit("Meme Added Successfully")}
          />{" "}
        </Popup>
      )}
      {formType === "edit" && (
        <Popup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          title="Edit Meme"
        >
          {" "}
          <EditForm
            afterSubmit={() => afterSubmit("Meme Edited Successfully")}
            editItem={editItem}
          />{" "}
        </Popup>
      )}
      {formType === "like" && (
        <Popup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          title="Like Meme"
        >
          {" "}
          <LikeDislike
            afterSubmit={() => afterSubmit("Liked by user!!")}
            likeDislikeItem={likeDislikeItem}
            type={formType}
          />{" "}
        </Popup>
      )}
      {formType === "dislike" && (
        <Popup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          title="Dislike Meme"
        >
          {" "}
          <LikeDislike
            afterSubmit={() => afterSubmit("Disliked by user!!")}
            likeDislikeItem={likeDislikeItem}
            type={formType}
          />{" "}
        </Popup>
      )}
      {formType === "comment" && (
        <Popup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          title="Add Comment"
        >
          {" "}
          <CommentForm
            afterSubmit={() => afterSubmit("Comment Added Successfully!!")}
            commentItem={commentItem}
          />{" "}
        </Popup>
      )}
      <ToastContainer />
    </div>
  );
}
