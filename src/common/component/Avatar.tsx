import { useCallback } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: number;
  bgColor?: string;
  textColor?: string;
}
const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  name = "User",
  size = 50,
  bgColor = "#0065ff",
  textColor = "#fff",
}) => {
const getInitials = useCallback((name: string) => {
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("").toUpperCase();
  return initials.substring(0, 2);
}, []);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: src ? "transparent" : bgColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: size / 2.5,
        fontWeight: "bold",
        color: textColor,
        cursor: "pointer",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <span style={{cursor: "none"}}>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;