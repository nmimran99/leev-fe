import './App.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Login } from './components/user/Login';
import { PasswordRecovery } from './components/user/PasswordRecovery';
import { ProtectedWorkspace } from './components/workspace/ProtectedWorkspace';
import { InitialRouter } from './components/routes/InitialRouter';
import { Workspace } from './components/workspace/Workspace';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './themes/theme';
import { FiltersContextProvider } from './context/FiltersContext';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import { LanguageContext } from './context/LanguageContext';
import { SnackbarContextProvider } from './context/SnackbarContext';
import { Chatbot } from './components/chatbot/Chatbot';
import { ResetPassword } from './components/user/ResetPassword';


function App() {
	const { lang } = useContext(LanguageContext);
	const jss = create({
		plugins: [...jssPreset().plugins, lang.code === 'he' ? rtl() : null],
	});

	return (
		<StylesProvider jss={jss}>
			<div className="App" dir={lang.dir}>
				<ThemeProvider theme={{...theme, direction: lang.dir}}>
					<Router>
						<Switch>
							<InitialRouter exact path="/"></InitialRouter>
							<Route path="/login">
								<Login />
							</Route>
							<Route path="/passwordrecovery">
								<PasswordRecovery />
							</Route>
							<Route path="/reset/:handle">
								<ResetPassword />
							</Route>
							<ProtectedWorkspace path="/workspace">
								<SnackbarContextProvider>
									<FiltersContextProvider>
										<Workspace />
									</FiltersContextProvider>
								</SnackbarContextProvider>
							</ProtectedWorkspace>
							<Route path="/open/:assetId">
								<Chatbot />
							</Route>
						</Switch>
					</Router>
				</ThemeProvider>
			</div>
		</StylesProvider>
	);
}

export default App;
