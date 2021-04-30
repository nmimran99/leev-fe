import { FormControl, Grid, IconButton, makeStyles, MenuItem, Select } from '@material-ui/core';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import clsx from 'clsx';

export const MessageSelector = ({ value, options, handleInputChange, handleSendInput }) => {

    const classes = useStyles();
    const { lang } = useContext(LanguageContext);

    const handleChange = event => {
        let val = event.target.value;
        let text = options.find(o => o.value === val).name;
        handleInputChange({ text: text, value: val, type: 'string'});
    }

	return (
        <Grid item xs={12} className={classes.addComment}>
			<FormControl variant="outlined" className={classes.form}>
		<Select
            variant={"outlined"}
            value={ value }
            onChange={handleChange}
            className={classes.selectInput}
            MenuProps={{
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "center",
                },
                transformOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                },
                getContentAnchorEl: null,
                classes: {
                    paper: classes.menupaper,
            
                }
            }}
            
        >
            {
                options.map((option, i) => 
                    <MenuItem 
                        key={i}
                        value={option.value}
                        style={{ direction: lang.dir }}
                        className={classes.menuitem}
                    >
                        {option.name}
                    </MenuItem>
                )
            }
        </Select>
        </FormControl>
        <IconButton className={classes.postBtn} onClick={handleSendInput}>
				<SendRoundedIcon className={clsx(classes.icon, lang.dir === 'rtl' ? classes.mirror : null)} />
			</IconButton>
        </Grid>
	);
};

const useStyles = makeStyles((theme) => ({
    addComment: {
		display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content',
        padding: '0 5px'
	},
	form: {
		color: 'white',
        width: '100%',
        margin: '0 5px 0 0px'
	},
    selectInput: {
        padding: '4px 10px',
        borderRadius: '42px',
        background: 'rgba(255,255,255,0.1)',
		'&>div': {
			color: 'white',
			width: '90%',
            padding: '7px 10px',
            fontSize: '14px'
		},
		'& label': {
			color: 'white',
			paddingLeft: '5px',
		},
		'& fieldset': {
			borderColor: 'rgba(255,255,255,0.2)',
			borderRadius: '42px',
		},
    },
    menupaper: {
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        height: '200px',
        overflowY: 'auto',
        border: '1px solid rgba(255,255,255,0.2)',

    },
    menuitem: {
        color: 'white',
        width: '100%',
        '&:hover': {
            background: 'rgba(255,255,255,0.1)'
        }
    },
    postBtn: {
        background: '#3399ff',
		color: 'white',
        padding: '7px',
		margin: ' 0 5px 1px',
		'&:hover': {
			background: 'rgba(0,0,0,0.4)',
		},
	},
	icon: {
        fontSize: '20px',
        color: 'white'
	},
	mirror: {
		transform: 'scaleX(-1)',
	},
}));
