import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, ReactNode, useState } from 'react'
import '../../css/components/Dropdown.css'
type props = {
  title?: string
  children: dropdownOptions[]
  onLabelClick: () => void
  onItemClick?: () => void;
  extraNode?: ReactNode
}
type dropdownOptions = {
  id: string;
  label: string; 
}
const Dropdown: FC<props> = ({ title, children, onLabelClick, extraNode, onItemClick }) => {
  const [showDropdown, setShowDropDown] = useState(false)

  const onClickHandler = () => {
    setShowDropDown((prev) => !prev)
    onLabelClick()
  }
  const onElementClick = (event : React.MouseEvent<HTMLUListElement>) => {
    console.log(event.target)
    onItemClick?.()
  }
  return (
    <div className='dropdown'>
      <button
        onClick={onClickHandler}
        className='btn'>
        {title?? children[0].label}
        <FontAwesomeIcon icon={faArrowDown} />
      </button>
      {showDropdown &&
        <ul onClick={onElementClick}>
          {
            children?.map((e, idx) => (
              <li key={idx}>
                {e.label}
              </li>
            ))
          }
          {extraNode??null}
        </ul>
      }
    </div>
  )
}

export default Dropdown
