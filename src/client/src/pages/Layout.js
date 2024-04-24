import '../App.css'
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <div id="nav-bar">
                <span className="menu-item"><Link to="/">builds</Link></span>
                <span className="menu-item"><Link to="/users">users</Link></span>
                <span className="menu-item"><Link to="/components">components</Link></span>
            </div>
            
            <Outlet />
        </>
    )
};

export default Layout;