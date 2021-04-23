import { Backdrop, Grid, makeStyles, Modal, Paper } from '@material-ui/core';
import { useContext } from 'react';
import { useHistory, useLocation } from 'react-router';
import { LanguageContext } from '../../../context/LanguageContext';

export const Settings = ({ open, setOpen }) => {
	const classes = useStyles();
	const history = useHistory();
    const location = useLocation();
    const { lang, setLang } = useContext(LanguageContext);


	const handleClose = () => {
		setOpen(false);
	};

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
			<Fade in={true}>
				<Grid container justify="center" alignItems="center" style={{ outline: '0' }}>
					<Grid item xs={12} sm={10} md={8} lg={8} xl={6} className={classes.gridCont}>
						<Paper elevation={6} className={classes.paper} style={{ direction: lang.dir }}>
                            something
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
		padding: '10px 20px',
		overflowY: 'overlay',
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
}));
