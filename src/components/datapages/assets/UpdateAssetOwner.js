import React, { useEffect, useState } from 'react'
import { makeStyles, Button, Typography, Collapse, FormControl, Select, MenuItem } from '@material-ui/core'
import clsx from 'clsx'
import { getUserList } from '../../../api/userApi';

export const UpdateAssetOwner = ({ open, currentOwner, handleUpdate, handleCancel }) => {

    const [ siteOwner, setSiteOwner ] = useState(currentOwner);
    const [ userList, setUserList] = useState([]);

    useEffect(() => {
        getUserList()
        .then(data => {
            setUserList(data)
        }) 
    }, [])

    const handleChange = event => {
        setSiteOwner(event.target.value);
    }

    const classes = useStyles();
    return (
        <Collapse in={open}>
            <div className={classes.container}>
                <Typography className={classes.title}>
                    {`שינוי מנהל בניין`}
                </Typography>
                <div className={classes.inputs}>
                    {
                        Boolean(userList.length) &&
                        <div className={classes.cont}>
                            <FormControl variant='outlined' className={classes.textInput}  fullWidth>
                                
                                <Select
                                    value={siteOwner}
                                    onChange={handleChange}
                                >
                                    {
                                        userList.map( (user, i) => {
                                            return (
                                                <MenuItem value={user._id} key={i}>
                                                    {`${user.firstName} ${user.lastName}`}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    }           
                    <div className={classes.controls}>
                        <Button
                            className={clsx(classes.control, classes.save)}
                            onClick={() => handleUpdate()}
                        >
                            שמירה
                        </Button>
                        <Button
                            className={clsx(classes.control, classes.cencel)}
                            onClick={handleCancel}
                        >
                            ביטול
                        </Button>
                    </div>
                    
                    
                         
                </div> 
            </div>
        </Collapse>
        
    )

}

const useStyles = makeStyles(theme => ({
    container: {
        background: 'white',
        height: '170px',
        margin: '15px',
        borderRadius: '19px',
        boxShadow: 'rgba(0,0,0,0.25) 0px 2px 10px 5px',
    },
    title: {
        width: 'auto',
        padding: '5px 20px',
        border: `1px solid ${theme.palette.primary.main}`,
        background: theme.palette.primary.main,
        color: theme.palette.textPrimary,
        fontSize: '18px',
        borderRadius: '18px 18px 0 0',
        boxShadow: 'rgba(0,0,0,0.25) 0 2px 4px 1px'
    },
    inputs: {
        padding: '10px'
    },
    typeContainer: {
        display: 'flex'
    },
    textInput: {
        margin: '5px',    
    },
    cont: {
        display: 'flex'
    },
    controls: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    control: {
        width: '30%',
        border: '1px solid black',
        fontSize: '16px',
        margin: '5px',
        padding: '5px 30px',
        borderRadius: '30px'
    },
    save: {
        background: 'black',
        color: 'white'
    }
}))