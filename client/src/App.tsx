import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DataTable from './components/DataTable';

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/data" component={DataTable} />
            </Switch>
        </Router>
    );
};

export default App;