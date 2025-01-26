import { Avatar, Button,  Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToken } from "../../Hook/useToken";
import { SiTinyletter } from "react-icons/si";

export default function Navbar() {
  const { token, removeToken } = useToken();
  const navigate = useNavigate();
  const [userID, setUserID] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Verify token and set user ID
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    const verifyToken = async () => {
      try {
        const response = await axios.post('https://chirkut-server.vercel.app/api/v2/auth-user-info', { token });
        if (response.status === 200 && response.data.valid) {
          setUserID(response.data.decoded.id);
        } else {
          console.log("Something went wrong");
        }
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  // Fetch user info when userID changes
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userID) {
        try {
          const response = await axios.get(`https://chirkut-server.vercel.app/api/v2/users/${userID}`);
          if (response.status === 200) {
            setUserInfo(response.data.user);
          } else {
            console.log(response.data);
          }
        } catch (err) {
          console.error('Error fetching user info:', err);
        }
      }
    };

    fetchUserInfo();
  }, [userID]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className="bg-[#fdfdfd33] w-full h-20 flex justify-between items-center px-6">
      <Link to="/">
        <h2 className="flex justify-center gap-2 grey-qo-regular text-xl font-bold mb-2 text-[goldenrod]">
          <span className="text-4xl">ChirKut</span> <SiTinyletter />
        </h2>
      </Link>
      <div className="flex items-center gap-6">

        {userID ? (
          <Menu>
            <MenuHandler>
              <Avatar src="https://cdn-icons-png.flaticon.com/512/3607/3607444.png" className="border-[goldenrod] border-2 cursor-pointer" size="md" />
            </MenuHandler>
            <MenuList>
              <Link to="/profile"><MenuItem>Profile</MenuItem></Link>
              <Link to=""><MenuItem>Messages</MenuItem></Link>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <div className="flex gap-2">
            <Link to="/login"><Button className="bg-green-500">Login</Button></Link>
            <Link to="/register"><Button className="text-black bg-white">Sign Up</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
