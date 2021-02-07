import React, { useContext } from "react";
import axios from "axios";
import { useState } from "react";
import { MemeContext } from "../context/MemeContext";

export default function MemeForm() {
  const [memes, setMemes] = useContext(MemeContext);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const data = await axios.post("/memes", { name, url, caption });
      const list = await axios.get("/memes");
      setMemes(list.data);
      setName("");
      setUrl("");
      setCaption("");
    } catch (e) {
      alert("Duplicate Post");
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          class="inputField"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          class="inputField"
          name="url"
          placeholder="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <input
          class="inputField"
          name="caption"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />
        <button class="inputField">Submit</button>
      </form>
    </div>
  );
}
