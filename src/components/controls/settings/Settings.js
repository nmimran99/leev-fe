import { Backdrop, Fade, Grid, Icon, IconButton, makeStyles, Modal, Paper } from '@material-ui/core';
import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { LanguageContext } from '../../../context/LanguageContext';
import { SettingsMenu } from './SettingsMenu';
import { UserProfile } from './UserProfile';
import { Users } from './Users';

export const Settings = ({ open, handleClose}) => {
	const classes = useStyles();
	const history = useHistory();
    const location = useLocation();
    const { t } = useTranslation();
    const { lang, setLang } = useContext(LanguageContext);
    const [ active, setActive ] = useState('profile');


	return (
		<Modal
			open={open}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
			className={classes.modal}
		>
			<Fade in={open}>
				<Grid container justify="center" alignItems="center" style={{ outline: '0' }}>
					<Grid item xs={12} sm={12} md={12} lg={10} xl={6} className={classes.gridCont}>
						<Paper elevation={6} className={classes.paper} style={{ direction: lang.dir }}>
                            <Grid container className={classes.mainGrid}>
                                <Grid item xs={12} className={classes.headerRow}>
                                    <div className={classes.title}>
                                        {t("settings.title")}
                                    </div>
                                    <IconButton
                                        className={classes.closeBtn}
                                        onClick={handleClose}
                                    >
                                        <Icon classes={{root: classes.iconRoot}}>
                                            <img src="https://img.icons8.com/ios-filled/36/4a90e2/cancel.png"/>
                                        </Icon>
                                    </IconButton>
                                </Grid>
                                <Grid container className={classes.dataGrid}>
                                    <Grid item xl={3} lg={3} md={3} sm={2} xs={12}>
                                        <SettingsMenu
                                            active={active} 
                                            setActive={setActive}
                                        />
                                    </Grid>
                                    <Grid item xl={9} lg={9} md={9} sm={10} xs={12} className={classes.dataContainer}>
                                        {
                                            active === 'profile' &&
                                            <UserProfile />
                                        }
                                        {
                                            active === 'users' &&
                                            <Users />
                                        }

                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
					</Grid>
				</Grid>
			</Fade>
		</Modal>
	);
};

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
        backdropFilter: 'blur(10px)',
	},
	gridCont: {
		height: 'fit-content',
	},
	paper: {
		background: 'rgba(0,0,0,0.4)',
		border: '1px solid rgba(255,255,255,0.2)',
		borderRadius: '10px',
        overflowY: 'overlay',
        height: '80vh',
		[theme.breakpoints.down('sm')]: {
			height: '81vh',
			top: 0,
			borderRadius: '0',
			border: '0',
			padding: '10px 5px',
		},
		'&:focus': {
			outline: 'none',
		},
    },
    mainGrid: {
        height: '100%',
        width: '100%'
    },
    dataGrid: {
        height: '90%'
    },
    dataContainer: {
        height: '100%',
        width: '100%'
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        height: '10%',
        [theme.breakpoints.down('xs')]: {
            padding: '0 5px'
        }
    },
    title: {
        color: 'white',
        fontSize: '22px',
        padding: '0 20px',
    },
    iconRoot: {
		textAlign: 'center',
		width: '50px',
		height: '35px',
		display: 'grid',
		placeItems: 'center'
    },
    closeBtn: {
        padding: '6px'
    }
}));
