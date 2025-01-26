import { createBrowserRouter, Navigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import Login from "../Login";
import Register from "../Register";
import Verify from "../../Pages/Verify/Verify";
import MessagingCard from "../../Pages/Card/Card";
import Main from "../Layoout/Navbar/Main";
import Message from "../../Pages/SendMessage/Message";
import Messages from "../../Pages/Messages/Messages";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Main/>,
        children: [
            {
                path: "profile",
                element: <Profile/>,
        
            },
            
            {
                path: '',
                element: <Messages/>
            },
          
            {
                path: "messages/:id",
                element: <MessagingCard/>,
        
            },
            ]

    },

    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    }
    ,
    {
        path: '/verify',
        element: <Verify/>
    }
    ,
    {
         path: 'user/:name',
         element: <Message/>
    },
    {
        path: '*',
        element: <div>404 Not Found</div>
    },
    
])

export default router;