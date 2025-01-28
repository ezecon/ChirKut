import { useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import toast from "react-hot-toast";

const Message = () => {
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const {name} = useParams();

  const handleSend = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (!message) {
      toast.error("Please fill in message fields");
      return;
    }

    // Count words in the message
    const wordCount = message.trim().split(/\s+/).length;
    if (wordCount > 150) {
      toast.error("Message exceeds 150-word limit");
      return;
    }

    // Prepare data
    const data = { sender, message, receiver:name };
    try {
      const response = await axios.post(`https://chirkut-server.vercel.app/api/v2/messages/`, data);
      if (response.data) {
        console.log(response.data);
        toast.success("Message sent successfully!");
        setSender("");
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex  flex-col justify-center  items-center h-screen bg-[#daa52028]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-300">
        <div className="bg-[goldenrod] rounded-tl-2xl rounded-tr-2xl p-5">
          <h2 className="montserrat-alternates-bold text-xl font-bold mb-2 text-white">
            You can send messages anonymously
          </h2>
          <span className="montserrat-alternates-bold text-white text-xs">**if you don't want to reveal your name, keep the sender field empty**</span>
        </div>
        <form onSubmit={handleSend}>
          <div className="p-4">
            {/* Sender Input */}
            <input
              type="text"
              placeholder="Sender"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="montserrat-alternates-regular w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />

            {/* Dynamic Textarea for Message */}
            <textarea
              placeholder="Enter your message (Max 150 words)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="montserrat-alternates-regular w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
              rows={5}
              style={{ minHeight: "100px", maxHeight: "300px" }}
            />

            {/* Word Count */}
            <div className="montserrat-alternates-regular text-sm text-gray-600 mt-2">
              Word count: {message.trim().split(/\s+/).length}/150
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                className="montserrat-alternates-regular bg-[#ffc32c] text-white px-4 py-2 rounded-lg hover:bg-[goldenrod] transition"
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="montserrat-alternates-regular flex flex-col justify-center items-center gap-2 m-10 p-10 text-gray-600 text-sm">
        <span>Want your own message? </span>
        <Link to="/register">
            <Button className="bg-[goldenrod]">
              Register
            </Button>
        </Link>
      </div>
    </div>
  );
};

export default Message;
