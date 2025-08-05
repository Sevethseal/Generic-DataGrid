import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./Layout/Layout";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import ComparisonPage from "./pages/ComparisonPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/detail/:id" component={Detail} />
          <Route path="/comparison" component={ComparisonPage} />
        </Switch>
      </Layout>
    </Router>
  </ThemeProvider>
);

export default App;