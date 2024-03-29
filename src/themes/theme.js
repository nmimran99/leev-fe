import { createMuiTheme } from "@material-ui/core/styles";
import { grey, red } from "@material-ui/core/colors";

export const theme = createMuiTheme({
	overrides: {
		MuiButton: {
			root: {
				textTransform: "none",
				"&:hover": {
					boxShadow: "rgba(0,0,0,0.25) 2px 3px 2px 0px",
					backgroundColor: "none",
				},
			},
		},
		MuiOutlinedInput: {
			root: {
				paddingLeft: "10px",
				position: "relative",
				color: "white",
				"& $notchedOutline": {
					borderColor: "rgba(255,255,255,0.6)",
				},
				"&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
					borderColor: "rgba(255,255,255,0.8)",
					// Reset on touch devices, it doesn't add specificity
					"@media (hover: none)": {
						borderColor: "rgba(255,255,255,0.8)",
					},
				},
				"&$focused $notchedOutline": {
					borderColor: "white",
					borderWidth: 2,
				},
			},
		},
		MuiFormLabel: {
			root: {
				color: "white",
				padding: "0 5px",
				backgournd: "rgba(0,0,0,0.4)",
				"&$focused": {
					color: "white",
				},
			},
		},
		MuiPickersToolbar: {
			toolbar: {
				background: "rgba(0,0,0,0.6)",
			},
		},
		MuiPickersCalendarHeader: {
			switchHeader: {
				// backgroundColor: lightBlue.A200,
				// color: "white",
			},
		},
		MuiPickersDay: {
			day: {
				color: "rgba(0,0,0,0.8)",
			},
			daySelected: {
				backgroundColor: "black",
			},
			dayDisabled: {
				color: "rgba(0,0,0,0.4)",
			},
			current: {
				color: "black",
			},
		},
		MuiPickersModal: {
			dialogAction: {
				color: "blue",
			},
		},
	},

	typography: {
		fontFamily: `"Rubik", "Roboto", "Helvetica", "Arial", sans-serif`,
	},
	palette: {
		primary: {
			main: "rgba(0,0,0,0.5)",
		},
		secondary: {
			main: red["A700"],
		},
		textPrimary: {
			main: "rgba(255,255,255,0.8)",
		},
		textSecondary: {
			main: grey[100],
		},
		leading: "#42A5F5",
	},
});
