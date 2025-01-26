import { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { IoDownloadOutline } from "react-icons/io5";
import { SiTinyletter } from "react-icons/si";
import axios from "axios";
import { useParams } from "react-router-dom";

const MessagingCard = () => {
  const cardRef = useRef();
  const [data, setData] = useState({ sender: "", message: "" });
const {id} = useParams();
  // Fetch data from the API
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(`https://chirkut-server.vercel.app/api/v2/messages/${id}`); // Replace with your API endpoint
        if (response.data) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    fetchMessage();
  }, []);

  const handleDownload = async () => {
    if (cardRef.current) {
      const button = cardRef.current.querySelector(".download-button");
      if (button) button.style.display = "none"; // Temporarily hide the button

      try {
        const dataUrl = await toPng(cardRef.current);
        download(dataUrl, "messaging-card.png");
      } catch (error) {
        console.error("Error generating image:", error);
      } 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#daa52028]">
      <div
        ref={cardRef}
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-300"
      >
        <div className="flex flex-col justify-center items-center bg-[goldenrod] rounded-tl-2xl rounded-tr-2xl p-2">
          <img src="/logo.png"  className="w-36 mb-2 rounded-2xl" alt="" />
          <h2 className="montserrat-alternates-bold text-xl font-bold mb-2 text-white">
            {data.sender || "Annonymous"}
          </h2>
        </div>

        <div className="p-4">
          <div className="flex flex-col justify-center gap-2">
            <div className="montserrat-alternates-regular text-black text-s">
              {data.message }
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleDownload}
              className="bg-[#ffc32c] text-white px-4 py-2 rounded-lg hover:bg-[goldenrod] transition download-button"
            >
              <IoDownloadOutline />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingCard;
