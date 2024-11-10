import { CSSProperties, FC } from "react";
import '../../css/common/common.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
type props =  {
 style? : CSSProperties;
 text: string | undefined;
}
const ErrorHandler: FC<props> = ({text}) => {
  if(!text) return null;
  return (
    <div  className="error-handler">
      <span>
      <FontAwesomeIcon
        color={'red'}
        size={"lg"}
        icon={faTriangleExclamation} />
        {text}
      </span>
    </div>
  )
}


export default ErrorHandler
