import { FC, Fragment, ReactNode } from "react";
import MainNavigation from "./MainNavigation";

interface Props {
  children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <Fragment>
      <MainNavigation />
      <main className="container-fluid">{children}</main>
    </Fragment>
  );
};

export default Layout;
