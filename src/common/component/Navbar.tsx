import React, { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import '../../css/components/NavBar.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faGear, faArrowDown, faSignOut , faPenToSquare, faUser} from "@fortawesome/free-solid-svg-icons";
import Avatar from "./Avatar";
import { useAuth } from "../hooks/useAuth";
import Popover, { MenuItem } from "./Popover";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLDivElement>(null);
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  const menuItems: MenuItem[] = [
    { 
      label: 'Edit Profile',
      onClick: () => console.log('Edit Profile clicked'),
      iconProps: {icon: faPenToSquare, iconColor: "#0065ff", size: 'lg'}
    },
    { 
      label: 'View Profile',
      onClick: () => console.log('View Profile clicked'),
      iconProps: {icon: faUser, iconColor: "#0065ff", size: 'lg'}
    },
    { 
      label: 'Logout',
      onClick: handleLogout,
      iconProps: {icon: faSignOut, iconColor: "#0065ff", size: 'lg'}
    },
  ];
  return (
    <nav className='topbar-container'>
      <div className='topbar-btn'>
        <button type="button"  className="project-btn">Projects<FontAwesomeIcon icon={faArrowDown} /></button>
        <button type="button">Invite</button>
        <button type="button">Issues</button>
        <button type="button" className='create'>Create</button>
      </div>
      <div className='topbar-nav'>
        <NavLink to="#">
          <div className="nav-item">
            <FontAwesomeIcon icon={faGear} size='lg' color='white' />
          </div>
        </NavLink>
        <NavLink to="#">
          <div className="nav-item">
            <FontAwesomeIcon
              color='white'
              icon={faBell}
              size='lg' />
          </div>
        </NavLink>
        <Popover items={menuItems} anchorRef={avatarRef}>
          <Avatar size={40} name={user?.username ?? 'John Doe'} />
        </Popover>
      </div>
    </nav>
  );
};

export default Navbar;
