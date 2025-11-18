import { Route } from "react-router-dom";
import Header from "./components/Header";
import IssueDetail from "./components/IssueView";

export function IssueRoutes() {
  return (
    <>
      <Route path="issues" element={<Header />} />
      <Route path="issues/:id" element={<IssueDetail />} />
    </>
  );
}