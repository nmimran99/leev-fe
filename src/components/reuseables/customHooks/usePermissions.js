import React, { useContext, useState } from 'react';
import { getMinPermLevel } from '../../../api/permissionsApi';
import { AuthContext } from '../../../context/AuthContext';

export const usePermissions = (module, action, userList) => {
	const { auth } = useContext(AuthContext);
	const { permissions } = auth.user.role;
	const minPermLevel = getMinPermLevel(action);
    const permLevel = permissions.find((p) => p.module === module)[action];
 
	if (permLevel < minPermLevel) {
		return false;
	} else if (permLevel === 1) {
       
		if (userList) {
			if (userList.includes(auth.user._id)) {
				return true;
			}
        }
        return false;
	}
	return true;
};
