import React, { useContext, useState } from 'react';
import { makeStyles, useMediaQuery, Avatar, FormControl, OutlinedInput, Grid, ClickAwayListener, IconButton, Button } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import { useTranslation } from 'react-i18next';
import { UserItem } from '../user/UserItem';
import { ClearRounded } from '@material-ui/icons';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import clsx from 'clsx'
import { LanguageContext } from '../../context/LanguageContext';
import { AuthContext } from '../../context/AuthContext';
import { getDatediffString } from '../../api/genericApi';



export const CommentSection = ({ comments, avatar, saveComment }) => {
    
    const history = useHistory();
    const location = useLocation();
    const classes = useStyles();
    const { t, i18n }= useTranslation();
    const { lang } = useContext(LanguageContext);
    const { auth } = useContext(AuthContext);
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const [ commentList, setCommentList ] = useState(comments || []);
    const [ text, setText ] = useState('');
    const [ textFocused, setTextFocused ] = useState(false)

    const handleChange = event => {
        setText(event.target.value)
    }

    const handleSendComment = event => {
        event.stopPropagation();
        saveComment(text)
        .then(data => {
            
        })
        .finally(() => {
            setText('');
            setTextFocused(false);
        })
        
    }


    return (
        <Grid container >
            <Grid item xs={12} >
                <div className={classes.title}>
                    {t("comments.title")}
                </div>
            </Grid>
            {
                commentList.map((c,i) => 
                    <Grid item xs={10} className={clsx(classes.comment)} key={i}>
                        <div className={classes.commentContainer}>
                            <Avatar className={classes.avatar} alt={'abc'} src={c.user.avatar} style={{ height: '50px', width: '50px' }}/>
                            <div className={classes.data}>
                                <div className={classes.commenter}>
                                    {`${c.user.firstName} ${c.user.lastName}`}
                                </div>
                                <div className={classes.commentText}>
                                    {`${c.text}`}
                                </div>
                            </div>
                        </div>
                        <div className={classes.commentFooter}>
                            <div className={classes.footerField}> 
                                <Button className={classes.footerBtn}> 
                                    {t("comments.reply")}
                                </Button>
                            </div>
                            {
                                c.user._id == auth.user._id &&
                                <div className={classes.footerField}>
                                    {` · `}
                                    <Button className={classes.footerBtn}>
                                        {t("comments.edit")}
                                    </Button>
                                </div>
                                 
                            }
                            <div className={classes.footerField}>
                            {` · `}
                            <div className={ classes.timePassed}>
                                {`${getDatediffString(c.createdAt)}`}    
                            </div>
                            
                            </div>
                                      
                        </div>
                    </Grid>
                )
                
            }
            
            <ClickAwayListener onClickAway={() => setTextFocused(false)}> 
                <Grid item xs={12} sm={12} md={8} lg={6} xl={6} className={classes.addComment}>
                    <FormControl variant='outlined' className={classes.form}>
                        <OutlinedInput
                            value={ text || '' }
                            onChange={handleChange}
                            placeholder={t("comments.add")}
                            className={clsx(classes.textInput, textFocused ? classes.focused : null)}
                            onFocus={() => setTextFocused(true)}
                            multiline
                            classes={{
                                inputMultiline: classes.multiLine
                            }}
                        />
                        
                    </FormControl>
                    <IconButton 
                        className={classes.postBtn}
                        onClick={handleSendComment}
                    >
                        <SendRoundedIcon className={clsx(classes.icon, lang.dir === 'rtl' ? classes.mirror : null)}/>
                    </IconButton> 
                </Grid>
            </ClickAwayListener>
        </Grid>
    
    )
}

const useStyles = makeStyles(theme => ({
    title: {
        color: 'white',
        fontSize: '20px',
        padding: '20px 30px 10px',
        marginBottom: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
    },
    addComment: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        width: 'fit-content'
    },
    avatar: {
        margin: '0 10px'
    },
    form: {
        color: 'white',
        width: '100%'

    },
    textInput: {
        
        borderRadius: '42px',
        '& input': {
            color: 'white',
            width: '80%'
        },
        '& label': {
            color: 'white',
            paddingLeft: '5px' 
        },
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.6)',
            borderRadius: '42px'
        },
           
    },
    focused: {
        boxShadow: 'rgba(0,0,0,0.25) 2px 3px 2px 0px',
        background: 'rgba(0,0,0,0.4)'
    },
    postBtn: {
        color: 'white',
        padding: '7px',
        left: '-40px',
        marginBottom: '1px',
        '&:hover': {
            background: 'rgba(0,0,0,0.4)',
        }
    },
    icon: {
        fontSize: '20px'
    },
    mirror: {
        transform: 'scaleX(-1)'
    },
    comment: {
        display: 'flex',
        flexDirection: 'column',
        margin: '5px 0'
    },
    commentContainer: {
        width: 'fit-content',
        display: 'flex',
        padding: '10px 30px 10px 0px',
        margin: '0px 10px',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '50px',
        
    },
    commenter: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '13px',
        padding: '5px'
    },
    commentText: {
        color: 'white'
    },
    commentFooter: {
        display: 'flex',
        marginLeft: '40px',
        height: '20px'
    },
    footerField: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.4)',
    },
    footerBtn: {
        fontSize: '12px',
        padding: '1px 2px',
        margin: '0px 2px',
        minWidth: '0',
        width: 'fit-content',
        color: 'rgba(255,255,255,0.4)',
        borderRadius: '50px',
        '&:hover': {
            color: 'white',
            textDecoration: 'underline',
            boxShadow: 'none',
            background: 'transparent'
        }
    },
    timePassed: {
        fontSize: '12px',
        padding: '0px 2px',
        margin: '0 2px',
        minWidth: '0',
        width: 'fit-content',
        color: 'rgba(255,255,255,0.4)',
    },
    multiLine: {
        padding: '0px 20px'
    }

}))