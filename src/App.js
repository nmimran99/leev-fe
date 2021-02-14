import './App.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Login } from './components/user/Login';
import { ProtectedWorkspace } from './components/workspace/ProtectedWorkspace';
import { InitialRouter } from './components/routes/InitialRouter';
import { Workspace } from './components/workspace/Workspace'; 
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './themes/theme';
import { FiltersContextProvider } from './context/FiltersContext';
import { create } from 'jss';
import rtl  from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import { LanguageContext } from './context/LanguageContext';

function App() {
  const { lang } = useContext(LanguageContext);
  const jss = create({ plugins: [...jssPreset().plugins, lang.code === 'he' ? rtl() : null] });

  return (
    <StylesProvider jss={jss}>
      <div className="App" dir={ lang.code === 'he' ? 'rtl' : 'ltr'}>
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
    </StylesProvider>
    
  );
}

export default App;
