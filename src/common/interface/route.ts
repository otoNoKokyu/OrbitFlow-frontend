export interface RouteConfig {
    caseSensitive?: boolean;
    children?: RouteConfig[];
    element?: React.ReactNode;
    index?: boolean;
    path?: string;
  }
  