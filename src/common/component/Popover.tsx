import { IconDefinition, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useEffect, ReactNode, useState } from "react";

export interface MenuItem {
  label: string; 
  onClick: () => void;
  iconProps?: {
    icon: IconDefinition,
    iconColor: string,
    size?: SizeProp;
  };
}
interface PopoverProps {
  anchorRef: React.RefObject<HTMLDivElement>;
  children: ReactNode;
  items: MenuItem[];
}

const Popover: React.FC<PopoverProps> = ({ anchorRef, items, children }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        anchorRef.current &&
        popoverRef.current &&
        !anchorRef.current.contains(event.target as Node) &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        closePopover();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const anchorRect = anchorRef.current?.getBoundingClientRect();
  return (
    <>
      <div ref={anchorRef} onClick={togglePopover}>
        {children}
      </div>
      {
        isPopoverOpen && (

          <div
            ref={popoverRef}
            style={{
              position: "absolute",
              top: anchorRect ? anchorRect.bottom + window.scrollY : 0,
              backgroundColor: "#fff",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              zIndex: 1000,
              minWidth: "150px",
              overflow: "hidden",
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  item.onClick();
                  closePopover();
                }}
                style={{
                  display: "flex",
                  alignItems: 'center',
                  gap: 10,
                  padding: "10px 15px",
                  cursor: "pointer",
                  borderBottom: index !== items.length - 1 ? "1px solid #f0f0f0" : "",
                  backgroundColor: "#fff",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.backgroundColor = "#f9f9f9")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.backgroundColor = "#fff")
                }
              >
                {item.iconProps && <FontAwesomeIcon icon={item.iconProps.icon} size={item.iconProps.size} color={item.iconProps.iconColor} />}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )
      }
    </>
  );
};

export default Popover;