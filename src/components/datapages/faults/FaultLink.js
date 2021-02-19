import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

export const FaultLink = ({ faultId, size }) => {

    return (
        <Link
            to={`/workspace/faults/${faultId}`}
            style={{ textDecoration: 'none' }}
        >
           <span style={{
               color: 'white',
               fontSize: `${size}px`
           }}>
             {faultId}
           </span>
        </Link>
    )
}