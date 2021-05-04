import { Grid, makeStyles } from '@material-ui/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { getAssetExternal, getFullAddress } from '../../api/assetsApi';
import { authenticate, handleLS } from '../../api/userApi';
import logoBig from '../../assets/logo/leev_logo_white_long.png';
import { AuthContext } from '../../context/AuthContext';
import { MessageImage } from './MessageImage';
import { MessageInput } from './MessageInput';
import { Messages } from './Messages';
import { MessageSelector } from './MessageSelector';
import { MessageBoolean } from './MessageBoolean';
import * as scenarios from './Scenrio';

export const Chatbot = () => {

    const classes = useStyles();
    const { auth, setAuth } = useContext(AuthContext);
    const { t } = useTranslation();
    const params = useParams();
    const [ scenario, setScenario ] = useState(scenarios.openFault);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ scenarioStep, setScenarioStep ] = useState(null);
    const [ messages, setMessages ] = useState([]);
    const [ mainAsset, setMainAsset ] = useState(null);
    const [ inputValue, setInputValue ] = useState({ text: '', value: '', type: '' });
    const [ optionalValues, setOptionalValues ] = useState([]);
    const [ vault, setVault ] = useState({});
    const messageContainer = useRef();

    useEffect(() => {
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
        checkUserAuthentication();
    }, []);


    useEffect(() => {
        if (messageContainer) {
            messageContainer.current.scrollIntoView({ bahavior: 'smooth', block: 'start'}) 
        }    
    }, [ messages ])


    useEffect(() => {
        if (!params.assetId) {
            scenario = scenarios.assetNotFound;
        }
        getAssetExternal(params.assetId)
        .then(data => {
            if (!data.asset || !data.systems) { 
                scenario = scenarios.assetNotFound;
            }
            setMainAsset(data.asset);
            setOptionalValues([...data.systems.map((s,i) => ({ name: s.name, value: s._id }))]);
            setScenario(prev => {
                prev.submitInput(data.asset._id, 'asset');
                return prev;
            });
            setScenarioStep(scenario.questions[0]);
        })
    }, [params])


    useEffect(() => {
        if (!scenarioStep) return;
        setTimeout(async () => {
            setMessages([...messages, { text: scenarioStep.text, isUser: false, type: 'string' } ]);
            if (!scenarioStep.actionRequired) { 
                if (isLastStep()) {
                    let sc = await scenarios.getNextScenario(scenario, auth);
                    setScenario(sc);
                    setScenarioStep(null);
                    setScenarioStep(sc.questions[0]);
                    return;
                } 
                setScenarioStep(scenario.questions[scenarioStep.order + 1]);
            }
        }, 1000);    
    }, [scenarioStep])


    const handleInputChange = async inputVal => {
        if (!inputVal.value && inputVal.type === 'image') {
            setMessages([...messages, { text: inputVal.text, isUser: true, type: inputVal.type } ]);
            await handleSubmit();
        }
        if (inputVal.type === 'boolean') {
            setScenario(prev => {
                prev.submitInput(inputVal.value, scenarioStep.inputField);
                return prev;
            })
            setMessages([...messages, { text: inputVal.text, isUser: true, type: inputVal.type } ]);
            await handleSubmit();
            setInputValue({ text: '', value: '', type: '' });
            return;
        }
        setInputValue(inputVal);
    }


    const handleSendInput = async () => {
        setScenario(prev => {
            prev.submitInput(inputValue.value, scenarioStep.inputField);
            return prev;
        })
        setMessages([...messages, { text: inputValue.text, isUser: true, type: inputValue.type } ]);
        await handleSubmit();
       
    }


    const nextStep = async () => {
        setInputValue({ text: '', value: '', type: '' });
        if (isLastStep()) {
            let sc = await scenarios.getNextScenario(scenario, auth);
            setScenario(sc);
            setScenarioStep(null);
            setScenarioStep(sc.questions[0]);
            return;
        }
        setScenarioStep(null);
        setScenarioStep(scenario.questions[scenarioStep.order + 1])
    }


    const handleSubmit = async () => {
        if (!scenarioStep.submit) {
            nextStep();
            return;
        } 
        let res = await scenario.submit(vault);
        if (res) {
            setVault({
                ...vault, 
                ...res
            }); 
            nextStep();
        }
        
    }

    const isLastStep = () => {
        return scenarioStep.order + 1 === scenario.questions.length;
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
                    scenarioStep ? 
                    scenarioStep.inputType === 'string' ? 
                    <MessageInput 
                        handleInputChange={handleInputChange}
                        handleSendInput={handleSendInput}
                        value={inputValue.value}
                    /> : 
                    scenarioStep.inputType === 'select' ? 
                    <MessageSelector
                        value={inputValue.value}
                        options={optionalValues}
                        handleInputChange={handleInputChange}
                        handleSendInput={handleSendInput}
                    /> : 
                    scenarioStep.inputType === 'image' ? 
                    <MessageImage 
                        value={inputValue.value || []}
                        handleInputChange={handleInputChange}
                        handleSendInput={handleSendInput}
                    /> : 
                    scenarioStep.inputType === 'boolean' ?
                    <MessageBoolean 
                        handleInputChange={handleInputChange}
                    /> : null
                    : null
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
