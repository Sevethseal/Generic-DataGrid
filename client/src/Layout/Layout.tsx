import React, { ReactNode } from "react";
import { Container } from "@mui/material";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
