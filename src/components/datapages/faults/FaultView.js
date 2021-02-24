import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, Grid, useMediaQuery, List, ListItem, IconButton, Tooltip, LinearProgress } from '@material-ui/core';
import { useHistory, useLocation, useParams } from 'react-router';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { getFullAddress } from '../../../api/assetsApi';
import { useTranslation } from 'react-i18next';
import { Carousel } from '../../reuseables/Carousel';
import { ImageSearch } from '@material-ui/icons';
import { UserItem } from '../../user/UserItem';
import { FaultViewControls } from './FaultViewControls';
import { FaultLink } from './FaultLink';
import { ClearRounded } from '@material-ui/icons';
import { UserList } from '../../reuseables/UserList';
import dateFormat from 'dateformat'
import { LanguageContext } from '../../../context/LanguageContext';
import { CommentSection } from '../../reuseables/CommentSection';
import { getFault } from '../../../api/faultsApi';



export const FaultView = ({ fid }) => {
    
    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const { t, i18n } = useTranslation();
    const classes = useStyles();
    const { lang } = useContext(LanguageContext);
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const [ fault, setFault ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const { faultId } = useParams();
    const [ notExist, setNotExist ] = useState(false)

    useEffect(() => {
        if (!isLoading) return;
        if (!faultId && !fid) {
            setNotExist(true);
        }
        console.log(faultId)
        getFault(faultId || fid)
        .then(data => {
            setFault(data);
            console.log(data)
        })
        .finally(() => {
            setIsLoading(false);
        })

    }, [isLoading])

    useEffect(() => {
        if (fid || faultId) {
            setIsLoading(true);
        }
        
    }, [fid, faultId])


    return (
        isLoading ? 
        <LinearProgress />
        :
            <Grid container className={classes.container} justify='space-between' alignItems='flex-start'>
                <Grid item xs={12} className={classes.controls}>
                    <div className={classes.faultId}>
                        <FaultLink faultId={fault.faultId} size={18} />
                    </div>
                    <FaultViewControls id={fault._id} faultId={fault.faultId} />                
                </Grid>
                <Grid item xs={12} sm={12} md={11} lg={8} xl={6}  className={classes.rightContainer} >
                    <div className={classes.asset}>
                        {getFullAddress(fault.asset)}
                    </div>  
               
                    <div className={classes.title}>
                        { fault.title }
                    </div>
                    
                    <div className={classes.desc}>
                        <div className={classes.openDate}>
                            {`${t("faultsModule.createDate")} ${dateFormat(fault.createdAt, lang.dateformat )} `}
                        </div>
                        {fault.description}
                    </div>
                    {
                        Boolean(fault.images.length) &&
                        <Carousel 
                            images={fault.images}
                            isOpen={Boolean(fault.images.length)}
                        />
                    }
                </Grid>
                <Grid item xs={12} md={12} lg={3} xl={4} className={classes.leftContainer}>
                    <div className={classes.owner}>
                        <UserItem 
                            user={fault.owner}
                            showTitle
                            showPhone
                            size={12}
                            avatarSize={50}    
                        />
                    </div>
                    <UserList 
                        users={fault.following}
                        removeTooltip={t("faultsModule.controls.removeFollower")}
                        placeholder={t("faultsModule.noFollowers")}
                        title={t("faultsModule.followingUsers")}
                        handleRemove={() => null}
                        handleAdd={() => null}
                    />
                </Grid>
                <Grid item xs={12} className={classes.comments}>
                    <CommentSection 
                        comments={fault.comments}
                        avatar={fault.owner.avatar}
                    />
                </Grid>

            </Grid>      
    )
}

const useStyles = makeStyles(theme => ({
    container: {
        overflowY: 'overlay',
        height: '100%'
    },
    rightContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        margin: '0 30px',
        [theme.breakpoints.down('sm')]: {
            alignItems: 'center'
        }
        
    },
    asset: {
        color: 'white',
        fontSize: '16px',
        background: 'black',
        width: 'fit-content',
        padding: '10px 20px',
        borderRadius: '25px',
        boxShadow: 'rgba(0,0,0,0.25) 0 0 5px 2px'
    },
    title: {
        color: 'white',
        fontSize: '22px',
        padding: '20px 0',
        alignSelf: 'flex-end',
        width: '100%'
    },
    desc: {
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '10px',
        padding: '20px',
        color: 'white',
        border: '1px solid rgba(255,255,255, 0.2)',
        width: '90%'
    },
    leftContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        padding: '10px 30px',
        [theme.breakpoints.down('sm')]: {
            alignItems: 'center',
        }
    },
    owner: {
        background: 'rgba(0,0,0,0.4)',
        padding: '5px 30px',
        borderRadius: '10px',
        width: 'fit-content',
        height: '70px'
        
    },
    controls: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 30px'
    },
    faultId: {
        padding: '10px 0'
    },
    linked: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        background: 'rgba(0,0,0,0.4)',
        margin: '10px 0',
        borderRadius: '10px',
        padding: '10px 0',
        height: '300px'
       
    },
    linkedHeader: {
        color: 'white',
        fontSize: '16px',
        padding: '5px',
        margin: '0px auto',
        width: '80%',
        borderBottom: '1px solid rgba(255,255,255,0.2)'

    },
    followingList: {
        padding: '5px',
        overflowY: 'auto',
        
    },
    listItem: {
        width: '250px',
        borderRadius: '5px',
        '&:hover': {
            background: 'rgba(0,0,0,0.4)',
        }
    },
    removeUser: {
        color: 'white',
        '&:hover': {
            background: 'rgba(0,0,0,0.3)'
        }
    },
    openDate: {
        color: 'white',
        fontSize: '14px',
        margin: '0 0 15px 0px',
        padding: '7px 15px',
        background: 'rgba(0,0,0,0.4)',
        width: 'fit-content',
        borderRadius: '50px'
    },
    comments: {
        background: 'rgba(0,0,0,0.2)',
        margin: '20px 30px',
        borderRadius: '10px',
        [theme.breakpoints.down('sm')]: {
            margin: '20px 0px',
        }
    }
    
}))