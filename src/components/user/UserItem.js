import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext'
import { makeStyles, Avatar, Typography, Button } from '@material-ui/core'
import avtrImg from '../../assets/images/users/avatars/600e048ccbe5b841e4f9e7ed.jpg'
import { getUserDataById } from '../../api/userApi';


export const UserItem = ({ user, showPhone, showTitle, avatarSize, size }) => {

    const { auth } = useContext(AuthContext)
    const [ userData, setUserData ] = useState(user)
    const classes = useStyles();

    useEffect(() => {
        if (!user._id) {
            getUserDataById(user)
            .then(data => {
                console.log(data)
                setUserData(data)
 
            })
        }
    }, [user])


    return (
        <Button 
            className={classes.btnContainer}
        >
            <Avatar className={classes.avatar} alt={'abc'} src={userData.avatar} style={{ height: avatarSize || '60px', width: avatarSize || '60px' }}/>
            <div className={classes.dataContainer}>
                <Typography className={classes.fullname} style={{ fontSize: !size ? '16px' : `${size * 1.1}px`}}>
                    {`${userData.firstName} ${userData.lastName}`}
                </Typography>
                {
                    showTitle &&
                    <Typography className={classes.title} style={{ fontSize: !size ? '18px' : `${size * 1.3}px`}}>
                        {userData.title || 'עובד כללי'}
                    </Typography>
                }
                
                {
                    showPhone &&
                    <Typography className={classes.phoneNumber} style={{ fontSize: !size ? '14px' : `${size * 1}px`}}>
                        {userData.phoneNumber || '054-652-9994'}
                    </Typography>
                }
            </div>
        </Button>
    )
}

const useStyles = makeStyles(theme => ({
    btnContainer: {
        width: 'inherit',
        height: 'inherit',
        borderRadius: 'inherit',
        padding: 'inherit',
        display: 'flex',
        justifyContent: 'flex-start',
        '&:hover': {
            boxShadow: 'none',
            background: 'transparent' 
        }
    },
    dataContainer: {
        width: '90%',
        padding: '5px 0 0 15px',
        textAlign: 'left'
    },
    fullname: {
        width: '99%',
        color: 'lightgrey',
        lineHeight: 1,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    },
    title: {
        color: 'white',

    },
    phoneNumber: {
        color: 'white',
        width: 'auto',
        whiteSpace: 'nowrap'

    },
    avatar: {
        boxShadow: '0 1px 5px 5px rgb(0 0 0 / 20%)'
    }
}))