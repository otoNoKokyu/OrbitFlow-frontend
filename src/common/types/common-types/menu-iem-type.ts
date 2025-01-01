import { IconDefinition, SizeProp } from "@fortawesome/fontawesome-svg-core";

export interface MenuItem {
    label: string; 
    onClick: () => void;
    iconProps?: {
      icon: IconDefinition,
      iconColor: string,
      size?: SizeProp;
    };
  }