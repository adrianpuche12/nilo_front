import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AllUsers from "../Components/User/AllUsers";
import UserDetail from "../Components/User/UserDetail";


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
               
                  
                    <Route path="/allusers" element={<AllUsers />}></Route>
               
            </Routes>
        </Router>
    );
};

export default AppRoutes;
