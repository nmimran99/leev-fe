import React, { useContext, useState, useEffect } from 'react';
import { makeStyles, useMediaQuery, Avatar, FormControl, OutlinedInput, Grid, ClickAwayListener, IconButton, Button } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { useTranslation } from 'react-i18next';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import clsx from 'clsx'
import { LanguageContext } from '../../context/LanguageContext';
import { AuthContext } from '../../context/AuthContext';
import { getDatediffString } from '../../api/genericApi';
import _ from 'lodash'
import { green, red } from '@material-ui/core/colors';



export const CommentSection = ({ parent, saveComment, updateComment }) => {
    
    const history = useHistory();
    const location = useLocation();
    const classes = useStyles();
    const { t, i18n }= useTranslation();
    const { lang } = useContext(LanguageContext);
    const { auth } = useContext(AuthContext);
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const [ commentList, setCommentList ] = useState(parent.comments || []);
    const [ parentId, setParentId ] = useState(parent._id)
    const [ text, setText ] = useState('');
    const [ textFocused, setTextFocused ] = useState(false);
    const [ editComment, setEditComment ] = useState(null);
    const [ numOfComments, setNumOfComments ] = useState(3); 
    
    useEffect(() => {
        setCommentList(parent.comments);
        setParentId(parent._id);
    }, [parent])


    const handleChange = event => {
        setText(event.target.value)
    }

    const handleSendComment = event => {
        event.stopPropagation();
        saveComment(parentId, auth.user._id, text)
        .then(data => {
            setCommentList(data.comments)
        })
        .finally(() => {
            setText('');
            setTextFocused(false);
        })
        
    }

    const handleEditChange = event => {
        setEditComment({
            ...editComment,
            text: event.target.value
        })
    }

    const handleUpdateComment = async () => {
        const res = await updateComment(parentId, editComment._id, editComment.text);
        setCommentList(res.comments);
        setEditComment(null);
    }

    return (
        <Grid container >
            <Grid item xs={12} >
                <div className={classes.title}>
                    {t("comments.title")}
                </div>
            </Grid>
            {
                numOfComments < commentList.length &&
                <Grid item xs={12}>
                    <Button
                        className={classes.showMore}
                        onClick={() => setNumOfComments(numOfComments + 3)}
                    >
                        {t("comments.showMore")}
                    </Button>
                </Grid>
                
            }
            {
                _.takeRight(commentList, numOfComments).map((c,i) => 
                    <Grid item xs={10} className={clsx(classes.comment)} key={i}>
                        <div className={classes.commentContainer}>
                            <Avatar className={classes.avatar} alt={'abc'} src={c.user.avatar} style={{ height: '50px', width: '50px' }}/>
                            <div className={classes.data}>
                                <div className={classes.commenter}>
                                    {`${c.user.firstName} ${c.user.lastName}`}
                                </div>
                                {
                                    (Boolean(editComment) && editComment._id === c._id) ? 
                                    <div className={classes.editContainer}>
                                        <FormControl variant='outlined' className={classes.form}>
                                            <OutlinedInput
                                                value={ editComment.text || '' }
                                                onChange={handleEditChange}
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
                                            className={classes.save}
                                            onClick={handleUpdateComment}
                                        >
                                            <SaveRoundedIcon className={classes.icon}/>
                                        </IconButton>
                                        <IconButton 
                                            className={classes.cancel}
                                            onClick={() => setEditComment(null)}
                                        >
                                            <ClearRoundedIcon className={classes.icon} />
                                        </IconButton>
                                    </div>
                                    :
                                    <div className={classes.commentText}>
                                        {`${c.text}`}
                                    </div>
                                }
                                
                            </div>
                        </div>
                        <div className={classes.commentFooter}>
                            {/* <div className={classes.footerField}> 
                                <Button className={classes.footerBtn}> 
                                    {t("comments.reply")}
                                </Button>
                            </div> */}
                            {
                                c.user._id == auth.user._id &&
                                <div className={classes.footerField}>
                                    {/* {` · `} */}
                                    <Button 
                                        className={classes.footerBtn}
                                        onClick={() => setEditComment(c)}
                                    >
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
        padding: '15px 10px',
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
        borderRadius: '35px',
        
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
    },
    showMore: {
        margin: '5px 30px',
        color: 'white',
        fontSize: '16px',
        padding: '5px',
        '&:hover': {
            boxShadow: 'none',
            background: 'inherit',
            textDecoration: 'underline'
        }
    },
    save: {
        background: green[800],
        padding: '8px',
        margin: '18px 5px',
        
    },
    cancel: {
        background: red[800],
        padding: '8px',
        margin: '18px 5px',
       
    },
    editContainer: {
        height: 'auto',
        margin: 'auto 0',
        width: '100%',
        dispaly: 'flex',
        justifyContent: 'center'
    },

}))