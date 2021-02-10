import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles, Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  Button: {
    backgroundColor: "#fca311",
  },
  head: {
    backgroundColor: "#03071e",
  }
}));

export default function Appbar(props) {
  const { onClick } = props;
  const classes = useStyles();

  return (
    <div>
      <AppBar position="fixed" className={classes.head}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Meme-Stream
          </Typography>
          <Button
            variant="contained"            
            startIcon={<AddIcon />}
            onClick={onClick}
            className={classes.Button}
          >
            Add Meme
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
