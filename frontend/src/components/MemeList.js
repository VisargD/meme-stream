import React, { useContext, useState } from "react";
import MemeForm from "./forms/MemeForm";
import { MemeContext } from "../context/MemeContext";
import axios from "axios";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import Popup from "./controls/Popup";
import EditForm from "./forms/EditForm";
import {
  makeStyles,
  Grid,
  Container,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Card,
} from "@material-ui/core";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

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

export default function MemeList() {
  const [memes, setMemes] = useContext(MemeContext);
  const [openPopup, setOpenPopup] = useState(false);

  const [editItem, setEditItem] = useState({});
  const classes = useStyles();
  const [formType, setFormType] = useState("");

  const deleteHandler = async (id) => {
    await axios.delete("/memes/" + id);
    const data = await axios.get("/memes");
    setMemes(data.data);
  };

  const afterSubmit = () => {
    setOpenPopup(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Meme-Stream
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setFormType("add");
              setOpenPopup(true);
            }}
          >
            Add Meme
          </Button>
        </Toolbar>
      </AppBar>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {memes.map((meme) => (
            <Grid item key={meme.id} xs={12} sm={6} md={6}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={meme.url}
                  title={meme.caption}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {meme.name}
                  </Typography>
                  <Typography>{meme.caption}</Typography>
                </CardContent>
                <CardActions>
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
                      setEditItem(meme);
                      setFormType("edit");
                      setOpenPopup(true);
                    }}
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      );
      {formType === "add" && (
        <Popup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          title="Add Meme"
        >
          {" "}
          <MemeForm afterSubmit={afterSubmit} />{" "}
        </Popup>
      )}
      {formType === "edit" && (
        <Popup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          title="Edit Meme"
        >
          {" "}
          <EditForm afterSubmit={afterSubmit} editItem={editItem} />{" "}
        </Popup>
      )}
    </div>
  );
}
