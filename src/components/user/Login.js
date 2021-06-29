import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { grey } from '@material-ui/core/colors';
import { 
    Container, 
    Grid,
    Box, 
    Typography, 
    FormControl, 
    OutlinedInput, 
    InputAdornment, 
    InputLabel, 
    IconButton,
    Button,
    Link,
    CircularProgress,  
    makeStyles, 
    Fade
} from '@material-ui/core';
import { Visibility, VisibilityOff, Error } from '@material-ui/icons';
import colorSplash from '../../assets/images/grey.jpg';
import { attemptToSignin, handleLS } from '../../api/userApi';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { getLocalization } from '../../api/genericApi';
import { ChangeLanguage } from '../reuseables/ChangeLanguage';


export const Login = () => {
    
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const loginButton = useRef();
    const { t } = useTranslation();
    const { setLang } = useContext(LanguageContext);

    const [ values, setValues ] = useState({
        email: '',
        password: '',
        showPassword: false
    });

    const [ errors, setErrors ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);

    const handleChange = (type) => (event) => {
        setValues({ ...values, [type]: event.target.value })
        setErrors(errors => errors.filter(e => (e.field !== type && e.field !== 'both')))
    }

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword})
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        let isValid = await validateFields();
        if (isValid) setErrors([]);

        let res = await attemptToSignin({
            email: values.email,
            password: values.password
        });

        if (res.status === 401) {
            setErrors([{ 
                field: 'both',
                message: 'Email or Password were Incorrect'
            }]);
        } else if (res.status === 500) {
            setErrors([{ 
                field: 'both',
                message: 'Internal server error. Please contact the system administrator.'
            }]); 
        } else if (res.status === 200) {

            await handleLS('wb_token', 'set', res.data.token);
            await handleLS('wb_user', 'set', res.data.user);
            await handleLS('wb_lang', 'set', { lang: res.data.user.lang });
            setLang(getLocalization(res.data.user.lang))
            if (location.state) {
                history.push(location.state.from.pathname || '');
            } else {
                history.push('/workspace/dashboard');
            }
            
        }
        
        setIsLoading(false);
    };

    const validateFields = async () => {
        return new Promise((resolve, reject) => {
            let errs = [];
            if (!values.email) {
                errs.push({ field: 'email', message: 'Email is required'});
            }
            if (!values.password) {
                errs.push({ field: 'password', message: 'Password is required'})
            };
            if (errs.length) {
                setErrors(errs)
                setIsLoading(false);
                reject(false);       
            };
            resolve(true);     
        })
    }

    const checkEnter = (e) => {
        if (e.keyCode === 13) {
            handleSubmit();
        }
    }

    return (
        
        <Grid container alignItems='center' justify='center' className={classes.mainContainer} >
            <Grid item className={classes.loginContainer} xl={3} lg={4} md={6} sm={10} xs={11}>
                <ChangeLanguage className={classes.changeLanguage}/>
                <Box className={classes.bannerContainer} bgcolor='primary.main'>
                    <img src='https://leevstore.blob.core.windows.net/images/leev_logo_transparent.png' className={classes.logo} />
                </Box>
                <Container component='div' className={classes.headerContainer}>
                    <Typography className={classes.header}>
                        {t("login.title")}
                    </Typography>
                </Container>
                <Container component='div' className={classes.inputsContainer}>
                    <FormControl variant='outlined' className={classes.textInput}>
                        <InputLabel htmlFor='outlined-input-email'>{t("login.email")}</InputLabel>
                        <OutlinedInput
                            error={ errors.filter(e => e.field === 'email').length > 0 }
                            id="outlined-input-email"
                            type='text'
                            value={values.email}
                            onChange={handleChange('email')}
                            labelWidth={70}
                        />
                    </FormControl>
                    <FormControl variant='outlined' className={classes.textInput}>
                        <InputLabel htmlFor='outlined-input-password'>{t("login.password")}</InputLabel>
                        <OutlinedInput
                            error={ errors.filter(e => e.field === 'password').length > 0 }
                            id='outlined-input-password' 
                            type={values.showPassword ? 'text' : 'password'}
                            value={ values.password }
                            onChange={handleChange('password')}
                            labelWidth={70}
                            onKeyDown={checkEnter}
                            endAdornment={
                                <InputAdornment position='end'>
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>                   
                </Container>
                {
                    errors.length > 0 ?
                    errors.map((e,i) => {
                        return (
                            <Container component='div' className={classes.errorContainer} key={i}>
                                <Error fontSize='inherit' color={'error'} />
                                <Typography component='span' className={classes.error} color='error'>
                                    {e.message}
                                </Typography>
                            </Container>
                        )
                    })  
                    : null
                }
                <Container component='div' className={classes.submitContainer}>
                    <Button 
                        variant='contained'
                        className={classes.submitButton}
                        color='primary'
                        onClick={handleSubmit}
                        disabled={isLoading}
                        ref={loginButton}   
                    >
                    {
                        isLoading ? 
                        <CircularProgress color={'secondary'} size={30}/> :
                        t("login.login")
                    }
                    
                    </Button>
                </Container>
                <Container className={classes.forgotPassContainer}>
                    <Typography className={classes.forgotPass}>
                        <Link href='/passwordrecovery'
                        >
                            {t("login.forgotPassword")}
                        </Link> 
                    </Typography>
                </Container>
            </Grid>
        
        </Grid>
        
    )
};

const useStyles = makeStyles({
    mainContainer: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundImage: `url(${colorSplash})`,
        backgroundSize: 'cover'
    },
    loginContainer: {   
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.18)',
        padding: '0',
        background: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgb(0 0 0 / 37%)',
        backdropFilter: 'blur(8px)',
        '-webkit-backdrop-filter': 'blur( 10px )',
        height: 'fit-content'
    },
    bannerContainer: {
        width: '100%',
        borderRadius: '10px 10px 0 0',
        padding: '0',
        display: 'grid',
        placeItems: 'center'
    },
    banner: {
        color: grey[50],
        fontWeight: 600,
        fontSize: '24px',
        position: 'relative',
        margin: 'auto',
        fontFamily: 'Kaushan'
    },

    headerContainer: {
        width: '100%',
        height: '50px',
        display: 'grid',
        placeItems: 'center',
        margin: '40px 0 0 0'
    },
    header: {
        fontSize: '24px',
        fontWeight: '300',
        height: '70%',
        color: 'white'
    },
   
    inputsContainer: {
        width: '100%',
        height: '165px',
        display: 'grid',
        placeItems: 'center',
        padding: '28px 14px 0px'
    },
    textInput: {
        width: '80%',
        '& .MuiOutlinedInput-root': {
            '& input': {
                padding: '18.5px 28px'
            },
            
        }
    },
    submitContainer: {
        width: '100%',
        display: 'grid',
        placeItems: 'center',
        padding: '7px 14px'
    },
    submitButton: {
        width: '80%',
        height: '50px',
        margin: 'auto',
        position: 'relative',
        fontSize: '18px',
        borderRadius: '50px'
    },
    forgotPassContainer: {
        width: '100%',
        padding: '0px 64px 60px'
    },
    forgotPass: {
        fontSize: '14px'
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'initial',
        width: '75%',
        padding: '0',
        fontSize: '18px'
    },
    error: {
        marginLeft: '8px',
        fontSize: '12px'
    },
    logo: {
        width: '100px',
        height: '100px'
    },
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
        height: 'fit-content'
    },
    changeLanguage: {
        position: 'absolute'
    }

})