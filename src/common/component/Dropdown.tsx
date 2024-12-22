import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, ReactNode, useState } from 'react'
import '../../css/components/Dropdown.css'
type props = {
  title: string
  children: ReactNode[]
  onClick?: ()=> void
}
const Dropdown: FC<props> = ({ title, children, onClick }) => {
  const [showDropdown, setShowDropDown] = useState(false)

  const onClickHandler = () => {
    setShowDropDown((prev) => !prev)
    onClick?.()
  }
  return (
    <div className='dropdown'>
      <button
        onClick={onClickHandler}
        className='btn'>
        {title}
        <FontAwesomeIcon icon={faArrowDown} />
      </button>
      {showDropdown && 
      <ul>
        {
          children?.map((e,idx)=>(
            <li key={idx}>
              {e}
            </li>
          ))
        }
        
      </ul>
      
      }
     


    </div>
  )
}

export default Dropdown
