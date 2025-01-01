import React, { useCallback, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../css/components/NavBar.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faGear, faArrowDown, faSignOut, faPenToSquare, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Popover, PopoverContent } from "../../components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { MenuItem } from "../types/common-types/menu-iem-type";
import { Card, CardHeader } from "../../components/ui/card";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
    localStorage.clear();
  };

  const avatarName = useMemo(() => {
    const names = user?.username?.split(" ") ?? [];
    const initials = names.map((n) => n[0]).join("").toUpperCase();
    return initials.substring(0, 2);
  }, []);

  const menuItems: MenuItem[] = [
    {
      label: 'Edit Profile',
      onClick: () => navigate('/user/edit'),
      iconProps: { icon: faPenToSquare, iconColor: "#0065ff", size: 'lg' }
    },
    {
      label: 'View Profile',
      onClick: () => console.log('view profile'),
      iconProps: { icon: faUser, iconColor: "#0065ff", size: 'lg' }
    },
    {
      label: 'Logout',
      onClick: handleLogout,
      iconProps: { icon: faSignOut, iconColor: "#0065ff", size: 'lg' }
    },
  ];

  return (
    <nav className='topbar-container'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost'>
          Project
          <span><FontAwesomeIcon icon={faArrowDown} /></span>
        </Button>
        <Button variant='ghost'>Invite</Button>
        <Button variant='ghost'>Issues</Button>
        <Button variant='default'>Create</Button>
      </div>
      <div className='flex items-center gap-4'>
        {/* <Button className="rounded-full">
          <Link to='#'>
            <FontAwesomeIcon icon={faGear} size='lg' color='white' />
          </Link>
        </Button> */}
        <Button className="rounded-full hover:rounded-full" size='icon'>
          <Link to='#'>
            <FontAwesomeIcon icon={faGear} size='lg' color='white' />
          </Link>
        </Button>
        <Button className="rounded-full hover:rounded-full" size='icon'>
          <Link to='#'>
            <FontAwesomeIcon icon={faBell} size='lg' color='white' />
          </Link>
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Avatar className='h-9 w-9'>
              <AvatarImage src={''} />
              <AvatarFallback className="bg-blue-700 text-white w-16 hover:cursor-pointer">{avatarName}</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-60 flex flex-col gap-2 mr-4">
            <Card className="rounded-sm bg-slate-100">
              <CardHeader className="flex flex-row items-center gap-5 p-4">
                <Avatar className='h-9 w-9'>
                  <AvatarImage src={''} />
                  <AvatarFallback className="bg-blue-700 text-white w-16 hover:cursor-pointer">{avatarName}</AvatarFallback>
                </Avatar>
                <h2 className="font-semibold">{user?.username?.toUpperCase()}</h2>
              </CardHeader>
            </Card>
            {
              menuItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-sm p-2 hover:bg-slate-200"
                >
                  <FontAwesomeIcon icon={item.iconProps?.icon ?? faUser} size='lg' color={'#172b4d'} />
                  <div
                    onClick={item.onClick}
                  >
                    {item.label}
                  </div>
                </div>
              ))
            }
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default Navbar;
