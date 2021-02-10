import React, { useContext } from "react";
import { MemeContext } from "../../context/MemeContext";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import {
  makeStyles,
  Grid,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Card,
} from "@material-ui/core";

import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@material-ui/icons/ThumbDownOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(2),
  },

  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function MemePost(props) {
  const {
    memeItem,
    onDeleteClick,
    onEditClick,
    onLikeClick,
    onDislikeClick,
  } = props;
  const { meme, like, dislike } = useContext(MemeContext);
  const [likes, setLikes] = like;
  const [dislikes, setDislikes] = dislike;

  const classes = useStyles();

  return (
    <Grid item key={meme.id} xs={12} sm={6} md={6}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={memeItem.url}
          title={memeItem.caption}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {memeItem.name}
          </Typography>
          <Typography>{memeItem.caption}</Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={onDeleteClick}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={onEditClick}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            startIcon={<ThumbUpOutlinedIcon />}
            onClick={onLikeClick}
          >
            {likes.find((obj) => obj.id === memeItem.id)
              ? likes.find((obj) => obj.id === memeItem.id).likes.length
              : 0}
          </Button>
          <Button
            variant="contained"
            startIcon={<ThumbDownOutlinedIcon />}
            onClick={onDislikeClick}
          >
            {dislikes.find((obj) => obj.id === memeItem.id)
              ? dislikes.find((obj) => obj.id === memeItem.id).dislikes.length
              : 0}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
