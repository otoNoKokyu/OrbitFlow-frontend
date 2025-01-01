import { CSSProperties, FC } from "react";
import '../../css/common/common.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
type props = {
  style?: CSSProperties;
  classnames?:string
  text: string | undefined;
  fontSize?: string;
}
const ErrorHandler: FC<props> = ({ text, fontSize,classnames }) => {
  if (!text) return null;
  return (
    <div
      className={classNames('error-handler',classnames)}>
      <span
        style={{ fontSize: fontSize ?? '10px' }}
      >
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
