export const getMinPermLevel = (requesttype) => {
	const types = {
		create: 2,
		update: 1,
		delete: 2,
		read: 1,
		changeOwner: 1,
		changeStatus: 1,
		changeRelatedUsers: 1,
		changeSchedule: 1,
		comment: 1,
		upload: 2,
		download: 2,

	};
	return types[requesttype];
};