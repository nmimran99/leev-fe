import React from 'react';
import { makeStyles } from '@material-ui/core';
import { FaultMinified } from './FaultMinified';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

export const FaultBlock = ({ data }) => {
    
    const classes = useStyles();

    return ( 
        <div 
            className={clsx(classes.faultContainer)}
        >
            <FaultMinified data={data} withLink={true} />
        </div>                               
    )
}

const useStyles = makeStyles(theme => ({ 
   faultContainer: {
    padding: '10px',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '7px',
    background: 'rgba(0,0,0,0.4)',
    margin : '5px 0'
   }
}))