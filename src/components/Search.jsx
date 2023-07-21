import React, { useContext, useState } from "react";
import {collection,query,where,getDocs,setDoc,doc,updateDoc,serverTimestamp,getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  // Get the cuurent user from AuthContext
  const { currentUser } = useContext(AuthContext);

  // It will search the user which is enter in find a user in DB and if found then it will load then user in sidebar
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  // on selecting a user on sidebar it will combine the both id and getDoc from db->chats combinedId and store in res 
  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      // If res doesnot exist it will create new combinedOd in chats and a message array
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        // Create chat of currentUser
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        // Create chat of user
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}
    // Here it reset the user and userName
    setUser(null);
    setUsername("")
  };
  return (
    <div className="search">
      <div className="searchForm">
        
        {/* onChange it check if placeholder value change means searching any user then it will update to username */}
        {/* On placeholder onKeyDown means on searchin a user on find a user it will  call handlekey function and the fuction will check if the event is enter key pressed and check if that user exist */}
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {/* If error then print span ->It is the result of find user*/}
      {err && <span>User not found!</span>}

      {/* If user exists on searching on find a user then show that user on sidebar . Initially user is null and on finding user if exist the load on sidebar else it will null*/}

      {/* on clicking on sidebar user the handleSelect funtion run which will load the message between user and onclick user if chat between both exists if not then create a new chat */}

      {/* hanldeSelect will load the messages of user selected on sidebar */}
      {user && (
        <div className="userChat" onClick={handleSelect}> 
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;