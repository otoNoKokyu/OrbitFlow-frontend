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
import ProjectForm from './Project'
import { Project } from '../Model/project.model'
import { selectConverter } from '../../../utility/objectUtils'
type Props = {
    username: string,
    userId: string;
}
const TopBar: FC<Props> = ({ username = 'AC',userId }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [modal, showModal] = useState(false)
    const [modalChild, setModalChild] = useState<React.ReactNode>();

    const dropDownExtraNode = (
        <button className='topbar-dropdown'
            onClick={() => openModal('create')}>
            <span>Create Project</span>
            <FontAwesomeIcon icon={faPlus} />
        </button>
    )
    const submitFn = (email: string, pId: string, role: RoleEnum) => {
        authService.inviteUser({ email, pId, role })
        showModal(false)
    }
    const dropdownClickHandler = async () => {
        const projects = await projectService.fetchUserProjects(userId)
        console.log(projects)
        setProjects(projects)
    }
    const openModal = (type: 'create' | 'Invite') => {
        showModal(true)
        if (type === 'Invite') setModalChild(<InviteEmail
            submitFn={submitFn}
            projects={projects}
            userId ={userId}
        />)
        else setModalChild(
            <ProjectForm />
        )
    }
    return (
        <>
            <div className='topbar-container'>
                <div className='topbar-btn'>
                    <Dropdown
                        extraNode={dropDownExtraNode}
                        title='Projects'
                        children={selectConverter(projects, (x) => x.id, (x) => x.name)}
                        onLabelClick={dropdownClickHandler}
                    />
                    <button onClick={() => openModal('Invite')}>
                        Invite
                    </button>
                    <button >
                        Issues
                    </button>
                    <button
                        className='create'>
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
                            {username}
                        </div>
                    </NavLink>

                </nav>
            </div>
            {modal &&
                <Modal
                    children={modalChild}
                    closeModal={() => showModal(false)}
                />
            }
        </>
    )
}

export default TopBar
