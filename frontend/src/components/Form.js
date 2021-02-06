import React from "react";

export default function Form() {

  return (
    <div>
      <form action='/memes' method='post' href='#'>
        <input class='inputField' name='name' placeholder='Name' />
        <input class='inputField' name='url' placeholder='url' />
        <input class='inputField' name='caption' placeholder='Caption' />
        <button class='inputField'>Submit</button>
      </form>
    </div>
  );
}
