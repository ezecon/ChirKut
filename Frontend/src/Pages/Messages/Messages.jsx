import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../Components/Hook/useToken";
import { Input } from "@material-tailwind/react";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useToken();
  const [userID, setUserID] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Verify token and set user ID
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.post(
          "https://chirkut-server.vercel.app/api/v2/auth-user-info",
          { token }
        );
        if (response.status === 200 && response.data.valid) {
          setUserID(response.data.decoded.id);
        } else {
          console.log("Invalid token");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    };

    verifyToken();
  }, [token, navigate]);

  // Fetch user info when userID changes
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userID) {
        try {
          const response = await axios.get(
            `https://chirkut-server.vercel.app/api/v2/users/${userID}`
          );
          if (response.status === 200) {
            setUserInfo(response.data.user);
          } else {
            console.log("Error fetching user info:", response.data);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, [userID]);

  // Function to calculate how long ago a message was sent
  const timeAgo = (timestamp) => {
    const now = new Date();
    const sentTime = new Date(timestamp);
    const difference = Math.floor((now - sentTime) / 1000); // Difference in seconds

    if (difference < 60) return `${difference} seconds ago`;
    if (difference < 3600) return `${Math.floor(difference / 60)} minutes ago`;
    if (difference < 86400) return `${Math.floor(difference / 3600)} hours ago`;
    return `${Math.floor(difference / 86400)} days ago`;
  };

  // Fetch messages when userInfo is available
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userInfo) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `https://chirkut-server.vercel.app/api/v2/messages/`
        );
        if (response.status === 200) {
          // Filter messages where the receiver matches the logged-in user's name
          const filteredMessages = response.data.data.filter(
            (message) => message.receiver === userInfo.name
          );
          console.log("Messages:", filteredMessages)
          setMessages(filteredMessages);
        } else {
          console.log("Error fetching messages:", response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userInfo]);

  //copy potion objects
  const [copied, setCopied] = useState(false);

  const textToCopy = userInfo ? `https://chirkut-pathao.vercel.app/user/${userInfo.name}` : "This is the text you can copy by clicking the button.";


  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    }).catch(err => {
      console.error("Failed to copy text:", err);
    });
  };
  return (
   <div>
        <div className="flex justify-center items-center ">
            <div className="bg-[#daa52028] p-6 rounded-lg shadow-lg text-center max-w-md ">
                  <Input
                  value={textToCopy}
                  className="bg-white"
                  />
                  <br />
                  <button
                    onClick={handleCopy}
                    className="montserrat-alternates-bold px-4 py-2 bg-[goldenrod] text-white rounded-lg  transition-colors"
                  >
                    {copied ? "Copied!" : "Copy Text"}
                  </button>
                  {copied && <p className="text-sm text-green-500 mt-2">Text copied to clipboard!</p>}
                </div>
        </div>
        <div className="max-w-3xl mx-auto p-6 bg-[#daa52028] rounded-lg shadow-lg mt-10">
        <h1 className="text-2xl font-bold text-center text-[goldenrod] mb-6">
          Messages
        </h1>
        {loading ? (
          <p className="text-center text-[goldenrod]">Loading messages...</p>
        ) : messages.length > 0 ? (
          <ul className="space-y-4">
            {messages.map((message) => (
              <li
                key={message._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/messages/${message._id}`)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-[goldenrod]">
                    New Message
                  </h2>
                  <span className="text-sm text-gray-500">
                    {timeAgo(message.time)}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{message.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No messages to display.</p>
        )}
      </div>
   </div>
  );
}
