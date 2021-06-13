import axios from "axios";

export const getDashboardData = async (filters) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/dashboard/getDashboardData`,
			filters,
			{
				headers: {
					module: "dashboard",
					requesttype: "read",
				},
			}
		);
		if (res.status === 200) {
			if (res.data.error) {
				return false;
			}
			return res.data;
		}
	} catch (e) {
		console.log(e.message);
		return false;
	}
};
