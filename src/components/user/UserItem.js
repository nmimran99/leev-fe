import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext'
import { makeStyles, Avatar, Typography, Button } from '@material-ui/core'
import { getUserDataById } from '../../api/userApi';


export const UserItem = ({ user, showPhone, showTitle, avatarSize, size }) => {

    const { auth } = useContext(AuthContext)
    const [ userData, setUserData ] = useState(user)
    const classes = useStyles();

    useEffect(() => {
        if (!user._id) {
            getUserDataById(user)
            .then(data => {
                setUserData(data)
            })
        } else {
            setUserData(user)
        }
    }, [user])


    return (
        <div 
            className={classes.btnContainer}
        >
            <Avatar className={classes.avatar} alt={'abc'} src={userData.avatar} style={{ height: avatarSize || '60px', width: avatarSize || '60px' }}/>
            <div className={classes.dataContainer}>
                <Typography className={classes.fullname} style={{ fontSize: `${size * 1.2}px` || '16px' }}>
                    {`${userData.firstName} ${userData.lastName}`}
                </Typography>
                {
                    showTitle &&
                    <Typography className={classes.title} style={{ fontSize: `${size * 1.1}px` || '18px' }}>
                        {userData.title || 'עובד כללי'}
                    </Typography>
                }
                
                {
                    showPhone &&
                    <Typography className={classes.phoneNumber} style={{ fontSize: `${size * 1}px` || '14px' }}>
                        {userData.phoneNumber || '054-652-9994'}
                    </Typography>
                }
            </div>
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    btnContainer: {
        width: 'fit-content',
        height: 'inherit',
        borderRadius: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        '&:hover': {
            boxShadow: 'none',
            background: 'transparent' 
        }
    },
    dataContainer: {
        marginLeft: '15px',
        width: '90%',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    fullname: {
        width: 'fit-content',
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