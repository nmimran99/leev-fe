import React, { useContext } from 'react';
import { AuthContext } from '../../../context/authContext'
import { makeStyles, Avatar, Typography, Button } from '@material-ui/core'
import avtrImg from '../../../assets/images/users/avatars/5fdd089738c8a758a8a1a957.JPG'


export const UserItem = ({}) => {

    const { auth } = useContext(AuthContext)
    const classes = useStyles();
    return (
        <Button 
            className={classes.userContainer}
        >
            <Avatar className={classes.avatar} alt={'abc'} src={avtrImg} />
            <div className={classes.dataContainer}>
                <Typography className={classes.fullname}>
                    {`${auth.user.firstName} ${auth.user.lastName}`}
                </Typography>
                <Typography className={classes.title}>
                    {`מנהל בניין`}
                </Typography>
            </div>
        </Button>
    )
}

const useStyles = makeStyles(theme => ({
    userContainer: {
        display: 'flex',
        width: '90%',
        margin: '20px auto',
        padding: '15px 10px',
        justifyContent: 'flex-start',
        borderRadius: '10px',
        boxShadow: '0 8px 32px 0 rgb(0 0 0 / 37%)',
        '&:hover' :{
            background: 'black',
            transition: 'background 0.2s ease',
            boxShadow: '0 8px 32px 0 rgb(0 0 0 / 80%)',
            
        }
    },
    dataContainer: {
        padding: '5px 0 0 15px',
        textAlign: 'left'
    },
    fullname: {
        color: 'lightgrey',
        lineHeight: 1
    },
    title: {
        color: 'white',
        fontSize: '18px'
    },
    avatar: {
        height: '60px',
        width: '60px',
        boxShadow: '0 1px 18px 10px rgb(0 0 0 / 40%)'
    }
}))