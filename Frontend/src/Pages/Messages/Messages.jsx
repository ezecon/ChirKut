import axios from "axios";
import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    // Simulate fetching messages from an API
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/v2/messages/`);
        if (response.status === 200) {
          setMessages(response.data.data);
        } else {
          console.log(response.data);
        }
      }catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#daa52028] rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-center text-[goldenrod] mb-6">Messages</h1>
      {loading ? (
        <p className="text-center text-[goldenrod">Loading messages...</p>
      ) : messages.length > 0 ? (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li
              key={message._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/messages/${message._id}`)} 
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[goldenrod]">New Message</h2>
                <span className="text-sm text-gray-500">{timeAgo(message.time)}</span>
              </div>
              <p className="text-gray-600 mt-2">{message.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No messages to display.</p>
      )}
    </div>
  );
}
