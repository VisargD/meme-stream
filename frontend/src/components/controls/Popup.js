import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
} from "@material-ui/core";
import MemeForm from "../MemeForm";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const useStyle = makeStyles((theme) => ({
  root: {
    "& .title": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  },
}));

export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup } = props;
  const classes = useStyle();
  return (
    <Dialog open={openPopup} className={classes.root}>
      <DialogTitle>
        <div className="title">
          {title}
          <IconButton onClick={() => setOpenPopup(false)}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
