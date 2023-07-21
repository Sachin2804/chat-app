import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";  // uuid is used to generate unique id. We use to assign a unique id to each message
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  // We can send text or image
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  // On click send button
  const handleSend = async () => {
    // If img send images else send text
    if (img) {
      //Create a unique image name
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // Update array from firebase -> update messages array -> arrayUnion
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                // We are sending unique id , text,senderId,date and image 
                // uuid() add unique id to message
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      // Update array from firebase -> update messages array -> arrayUnion
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          // We are sending unique id , text,senderId and date
            // uuid() add unique id to message 
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    // Update msg for current user -> sender
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    // Update msg for user -> Receiver
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    // After send make text empty and img null
    setText("");
    setImg(null);
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        // onchange placeholder value setText
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          // onChange setImg with selected img
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        {/* onClick call handleSend function and it will send the message */}
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;

