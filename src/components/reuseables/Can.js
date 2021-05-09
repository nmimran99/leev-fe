import React, { useState } from 'react';
import { getMinPermLevel } from '../../api/permissionsApi';
import { usePermissions } from './customHooks/usePermissions';



export const Can = ({ module, action, userList, shouldRender, children }) => {
    
    const isPermitted = usePermissions(module, action, userList);
    if (shouldRender === false) return null;
    
    return (
        isPermitted ? 
        <React.Fragment>
            {children}
        </React.Fragment>
        : null
    )
}