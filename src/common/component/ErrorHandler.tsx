import { CSSProperties, FC } from "react";
import '../../css/common/common.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
type props =  {
 style? : CSSProperties;
 text: string;
}
const ErrorHandler: FC<props> = ({style, text}) => {

  return (
    <div style={style?? {}} className="error-handler">
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
