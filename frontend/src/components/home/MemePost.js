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
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
    margin: theme.spacing(2),
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
    height: 0,
  },
  cardContent: {
    flexGrow: 1,
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function MemePost(props) {
  const {
    memeItem,
    onDeleteClick,
    onEditClick,
    onLikeClick,
    onDislikeClick,
    onCommentClick,
  } = props;

  const classes = useStyles();

  return (
    <Grid item key={memeItem.id} xs={12} sm={6} md={6}>
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
            size="small"
            variant="contained"
            startIcon={<ThumbUpOutlinedIcon />}
            onClick={onLikeClick}
          >
            {memeItem.likes ? memeItem.likes.length : 0}
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<ThumbDownOutlinedIcon />}
            onClick={onDislikeClick}
          >
            {memeItem.dislikes ? memeItem.dislikes.length : 0}
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<ChatBubbleOutlineIcon />}
            onClick={onCommentClick}
          >
            {memeItem.comments ? memeItem.comments.length : 0}
          </Button>
        </CardActions>
        <CardActions>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={onDeleteClick}
          >
            Delete
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EditIcon />}
            onClick={onEditClick}
          >
            Edit
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
