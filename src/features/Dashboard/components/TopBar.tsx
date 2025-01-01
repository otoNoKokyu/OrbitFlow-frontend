import React, { FC, useState } from 'react'
import '../../../css/components/NavBar.css'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faGear, faPlus } from '@fortawesome/free-solid-svg-icons'
import Dropdown from '../../../common/component/Dropdown'
import projectService from '../service/project.service'
import Modal from '../../../common/component/Modal'
import { InviteEmail } from './InviteEmail'
import authService from '../../Authentication/service/auth.service'
import { RoleEnum } from '../../../common/types/Auth/auth'
type Props = {
    name: string
}
const TopBar: FC<Props> = ({ name = 'AC' }) => {
    const [projects, setProjects] = useState<{ id: string; label: string }[]>([]);
    const [modal, showModal] = useState(false)
    const dropDownExtraNode = (
        <button className='topbar-dropdown'
        onClick={() => alert('coming soon')}>
            <span>Create Project</span>
            <FontAwesomeIcon icon={faPlus} />
        </button>
    )
    const submitFn = (email: string, pId: string, role: RoleEnum) => {
        authService.inviteUser({ email, pId, role })
        showModal(false)
    }
    const dropdownClickHandler = async () => {
        const projects = await projectService.fetchProjects()
        const projectNames = projects.map((e: { name: string; id: string }) => ({
            label: e.name,
            id: e.id,
        }));
        setProjects(projectNames)
    }

    return (
        <>
            <div className='topbar-container'>
                <div className='topbar-btn'>
                    <Dropdown
                        extraNode={dropDownExtraNode}
                        title='Projects'
                        children={projects.reverse()}
                        onLabelClick={dropdownClickHandler}
                    />
                    <button onClick={() => showModal(true)}>
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
                        <div style={{ background: 'blue' }}>
                            <FontAwesomeIcon icon={faGear} size='lg' color='white' />
                        </div>
                    </NavLink>
                    <NavLink to="#">
                        <div style={{ background: 'blue' }}>
                            <FontAwesomeIcon
                                color='white'
                                icon={faBell}
                                size='lg' />
                        </div>
                    </NavLink>
                    <NavLink
                        to="#">
                        <div
                            style={{ color: 'white', background: 'blue', textDecoration: 'none', fontWeight: 'bolder' }}

                        >
                            {name}
                        </div>
                    </NavLink>

                </nav>
            </div>
            {modal &&
                <Modal
                    children={
                        <InviteEmail
                            submitFn={submitFn}
                            projects={projects}
                        />
                    }
                    closeModal={() => showModal(false)}
                />
            }
        </>
    )
}

export default TopBar
