import { Avatar, FormControl, Grid, IconButton, makeStyles, OutlinedInput,  } from '@material-ui/core';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { authenticate, handleLS } from '../../api/userApi';
import { AuthContext } from '../../context/AuthContext';
import { LanguageContext } from '../../context/LanguageContext';
import { Messages } from './Messages';
import * as scenarios from './Scenrio';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import clsx from 'clsx';
import { MessageInput } from './MessageInput';
import logo from '../../assets/logo/leev_logo.png';
import logoBig from '../../assets/logo/leev_logo_white_long.png';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { getAssetExternal, getFullAddress } from '../../api/assetsApi';
import { MessageSelector } from './MessageSelector';
import { MessageImage } from './MessageImage';

export const Chatbot = () => {

    const classes = useStyles();
    const { auth, setAuth } = useContext(AuthContext);
    const { t } = useTranslation();
    const params = useParams();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ scenario, setScenario ] = useState(scenarios.notLoggedIn) ;
    const [ scenarioStep, setScenarioStep ] = useState(null);
   
    const [ messages, setMessages ] = useState([]);
    const [ mainAsset, setMainAsset ] = useState(null);

    const [ inputValue, setInputValue ] = useState({ text: '', value: null, type: null });
    const [ inputType, setInputType ] = useState(null);
    const [ optionalValues, setOptionalValues ] = useState([]);
    const messageContainer = useRef();
    
    // const checkUserAuthentication = async () => {
    //     let token = await handleLS('wb_token', 'get');
    //     if (!token) {
    //         setIsLoading(false);
    //         return;
    //     };
    //     let res = await authenticate(token);
    //     console.log(res)
    //     if (res.auth) {
    //        setAuth({
    //             isAuth: res.auth,
    //             user: res.user,
    //             token: res.token.token,
    //             refreshToken: res.token.refreshToken
    //         });
              
    //     }
    //     setIsLoading(false);
    //     return;
    //   }

    // useEffect(() => {
    //     checkUserAuthentication();
    // }, []);

    // useEffect(() => {
    //     if (auth.isAauth) {
    //         setScenario(scenarios.loggedIn)
    //         return;
    //     }
    //     setScenario(scenarios.notLoggedIn);
    // }, [auth])

    useEffect(() => {
        if (!params.assetId) {
            setScenario(scenarios.assetNotFound);
        }
        getAssetExternal(params.assetId)
        .then(data => {
            if (!data.asset || !data.systems) { 
                setScenario(scenarios.assetNotFound);
            }
            setMainAsset(data.asset);
            setOptionalValues([...data.systems.map((s,i) => ({ name: s.name, value: s._id }))]);
            setScenario(scenarios.notLoggedIn);
            setScenarioStep(1);
        })
    }, [params])


    useEffect(() => {
        if (!scenarioStep) {
            return;
        }
        let currStep = scenario.questions.find(s => s.order === scenarioStep)
        if (!currStep.actionRequired) {
            setTimeout(() => {
                setMessages([...messages, { text: currStep.text, isUser: false, type: 'string' } ])
                setScenarioStep(scenarioStep + 1);
                setInputType(null)
            }, 1000); 
            return;
        }
        setTimeout(() => {
            setMessages([...messages, { text: currStep.text, isUser: false, type: 'string' } ])
            setInputType(currStep.inputType)
        }, 1000);
        
    }, [scenarioStep])

    useEffect(() => {
        if (messageContainer) {
            messageContainer.current.scrollIntoView({ bahavior: 'smooth', block: 'start'}) 
            console.log(messageContainer.current)
        }    
    }, [ messages ])

    const handleInputChange = inputVal => {
        setInputValue(inputVal);
    }

    const handleSendInput = async () => {
        setMessages([...messages, { text: inputValue.text, isUser: true, type: inputValue.type } ]);
        setInputValue({ text: '', value: null, type: null });
        setInputType(null);
        const submitFunc = scenario.questions[scenarioStep - 1].submitFunc;
       // const res = await submitFunc(inputValue);
        setScenarioStep(scenarioStep + 1)
        // if (res) {
        //     setScenarioStep(scenarioStep + 1)
        // }
    }

	return (
		<div className={classes.gridContainer} >
            <div className={classes.addressContainer}>
                <div className={classes.title}>
                    {t("chatbot.title")}
                </div>
                <div className={classes.address}>
                    {mainAsset && getFullAddress(mainAsset)}
                </div>
            </div>
            <div ref={messageContainer} className={classes.messagesContainer}>
                {
                    messages.length ?
                    <Messages data={messages} /> : 
                    null
                }
                
            </div>
            <Grid container className={classes.inputContainer} alignItems='center'>
                {
                    inputType === 'string' ? 
                    <MessageInput 
                        handleInputChange={handleInputChange}
                        handleSendInput={handleSendInput}
                    /> : 
                    inputType === 'select' ? 
                    <MessageSelector
                        value={inputValue.value}
                        options={optionalValues}
                        handleInputChange={handleInputChange}
                        handleSendInput={handleSendInput}
                    /> : 
                    inputType === 'image' ? 
                    <MessageImage 
                        value={inputValue.value || []}
                        handleInputChange={handleInputChange}
                        handleSendInput={handleSendInput}
                    /> : 
                    null
                }
                
            </Grid>
        </div>
	);
};

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `url(${logoBig})`,
        backgroundRepeat: 'repeat'
		
    },
    addressContainer: {
        width: '100%',
        height: '40px',
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(5px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        padding: '15px'
    },
    messagesContainer: {
        height: 'calc(100% - 120px)',
        width: '100%',
        padding: '10px 0',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(2px)'
        
    },
    inputContainer: {
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(5px)',
        width: '100%',
        height: '50px',
        padding: '4px 0',
        borderTop: '1px solid rgba(255,255,255,0.2)'
    },
    topProfile: {
        width: '100%',
        display: 'grid',
        placeItems: 'center'
    },
    avatar: {
        height: '150px',
        width: '150px',
        margin: '10px'
    },
    welcome: {
        color: 'white',
        fontSize: '20px',
        margin: '5px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '50px',
        padding: '10px 25px',
    },
    welcomeSub: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '50px',
        padding: '10px 25px',
        margin: '10px 0 30px'
    },
    '@global': {
		'*::-webkit-scrollbar': {
			width: '0em',
        }
    },
    title: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '14px'
    },
    address: {
        color: 'white',
        fontSize: '20px'
    }
}));
