import React from 'react';
import { Link } from 'react-router-dom';

export const ItemLink = ({ itemId, module, size }) => {
	return (
		<Link
			to={`/workspace/${module}/${itemId}`}
			style={{ textDecoration: 'none' }}
		>
			<span
				style={{
					color: 'white',
					fontSize: `${size}px`,
					whiteSpace: 'nowrap',
				}}
			>
				{itemId}
			</span>
		</Link>
	);
};
