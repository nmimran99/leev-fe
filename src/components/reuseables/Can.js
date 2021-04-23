import React, { useState } from 'react';
import { getMinPermLevel } from '../../api/permissionsApi';
import { usePermissions } from './customHooks/usePermissions';



export const Can = ({ module, action, userList, children }) => {
    const isPermitted = usePermissions(module, action, userList);
    
    return (
        isPermitted ? 
        <React.Fragment>
            {children}
        </React.Fragment>
        : null
    )
}