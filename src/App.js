import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Login } from './components/user/Login';
import { ProtectedWorkspace } from './components/workspace/ProtectedWorkspace';
import { InitialRouter } from './components/routes/InitialRouter';
import { Workspace } from './components/workspace/Workspace'; 
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './themes/theme';
import { FiltersContextProvider } from './context/FiltersContext';

function App() {

  return (
    <div className="App">
      <ThemeProvider theme={ theme }>
          <Router>
            <Switch>
              <InitialRouter exact path='/'>

              </InitialRouter>
              <Route path='/login'>
                <Login />
              </Route>
              <ProtectedWorkspace path='/workspace'>
                <FiltersContextProvider>
                  <Workspace />
                </FiltersContextProvider>
              </ProtectedWorkspace>
            </Switch>
          </Router>
      </ThemeProvider>
      
    </div>
  );
}

export default App;
