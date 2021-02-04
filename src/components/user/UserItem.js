import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'
import { makeStyles, Avatar, Typography, Button } from '@material-ui/core'
import avtrImg from '../../assets/images/users/avatars/600e048ccbe5b841e4f9e7ed.jpg'


export const UserItem = ({ user, showPhone, showTitle, avatarSize }) => {

    const { auth } = useContext(AuthContext)
    const classes = useStyles();

    const userData = user || auth.user;

    return (
        <Button 
            className={classes.btnContainer}
        >
            <Avatar className={classes.avatar} alt={'abc'} src={userData.avatar || avtrImg} style={{ height: avatarSize || '60px', width: avatarSize || '60px' }}/>
            <div className={classes.dataContainer}>
                <Typography className={classes.fullname}>
                    {`${userData.firstName} ${userData.lastName}`}
                </Typography>
                {
                    showTitle &&
                    <Typography className={classes.title}>
                        {userData.title || 'עובד כללי'}
                    </Typography>
                }
                
                {
                    showPhone &&
                    <Typography className={classes.phoneNumber}>
                        {userData.phoneNumber || '054-652-9994'}
                    </Typography>
                }
            </div>
        </Button>
    )
}

const useStyles = makeStyles(theme => ({
    btnContainer: {
        width: '100%',
        height: 'auto',
        borderRadius: 'inherit',
        background: 'inherit',
        padding: 0,
        display: 'flex',
        justifyContent: 'flex-start'
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
    phoneNumber: {
        color: 'white',
        fontSize: '13px'
    },
    avatar: {
        boxShadow: '0 1px 5px 5px rgb(0 0 0 / 20%)'
    }
}))