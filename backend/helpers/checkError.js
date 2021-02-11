const checkError = (err, res) => {
  if (err.message === "Duplicate") {
    res.sendStatus(409);
  } else if (err.message === "Invalid URL") {
    res.sendStatus(422);
  } else if (err.message === "Bad Request") {
    res.sendStatus(400);
  } else if (err.message === "Not Found") {
    res.sendStatus(404);
  } else {
    res.send(err.message);
    res.sendStatus(500);
  }
};

module.exports = checkError;
