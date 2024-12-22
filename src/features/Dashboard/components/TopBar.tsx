import React, { FC, useEffect, useState } from 'react'
import '../../../css/components/NavBar.css'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faGear, faPlus } from '@fortawesome/free-solid-svg-icons'
import Dropdown from '../../../common/component/Dropdown'
import projectService from '../service/project.service'
import EmailInviteForm from './InviteEmail'

type Props = {
    name: string
}

const TopBar: FC<Props> = ({ name = 'AC' }) => {
    const [projects, setProjects] = useState([])
    const dropdownChldren: React.ReactNode[] = [
        (
            <button onClick={() => alert('coming soon')}>
                <span>Create Project</span>
                <FontAwesomeIcon icon={faPlus} />

            </button>
        ),
        ...projects
    ]

    const dropdownClickHandler = async () => {
        const projects = await projectService.fetchProjects()
        const projectNames = projects.map((e: { name: string }) => e.name)
        setProjects(projectNames)
    }

    return (
        <div className='topbar-container'>
            <div className='topbar-btn'>
                <Dropdown
                    title='Projects'
                    children={dropdownChldren.reverse()}
                    onClick={dropdownClickHandler}
                />
                <button>
                    Invite
                </button>
                <button>
                    Issues
                </button>
                <button className='create'>
                    Create
                </button>
            </div>
            <nav className='topbar-nav'>
                <NavLink to="#">
                    <div style={{background:'blue'}}>
                        <FontAwesomeIcon icon={faGear} size='lg' color='white' />
                    </div>
                </NavLink>
                <NavLink to="#">
                    <div style={{background:'blue'}}>
                        <FontAwesomeIcon
                            color='white'
                            icon={faBell}
                            size='lg' />
                    </div>
                </NavLink>
                <NavLink
                    to="#">
                    <div 
                    style={{color:'white', background:'blue', textDecoration: 'none', fontWeight: 'bolder' }}
                    
                    >
                        {name}
                    </div>
                </NavLink>

            </nav>
        </div>
    )
}

export default TopBar
