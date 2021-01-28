import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { Route, Redirect } from 'react-router-dom';
import { authenticate, handleLS } from '../../api/userApi';

export const ProtectedWorkspace = ({ children, isAuthenticated,...rest}) => {
    
    const { auth, setAuth } = useContext(AuthContext);
    const [ isLoading, setIsLoading ] = useState(true);

    const checkUserAuthentication = async () => {
        let token = await handleLS('wb_token', 'get');
        if (!token) {
            setIsLoading(false);
            return;
        };
        let res = await authenticate(token);
        if (res.auth) {
           setAuth({
                isAuth: res.auth,
                user: res.user,
                token: res.token.token,
                refreshToken: res.token.refreshToken
            });
              
        }
        setIsLoading(false);
        return;
      }

    useEffect(() => {
        checkUserAuthentication();
    }, []);

    return (
        <Route {...rest}
          render={() => isLoading ? 
            'loading' : 
            auth.isAuth
            ? children
            :   <Redirect
                    to={{
                    pathname: "/login"
                }}/>
            }      
        />
      );
}
