import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  // Initially messages is empty
  const [messages, setMessages] = useState([]);
  // data have combine id of currentuser and user
  const { data } = useContext(ChatContext);

  // onSnapshot is used to fetch data in realtime. If chatId is found in chats db -> doc.exists then set the messages
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  console.log(messages)

  return (
    <div className="messages">
      {/* array of message */}
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
