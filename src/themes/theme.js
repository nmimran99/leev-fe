import { createMuiTheme } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';


export const theme = createMuiTheme({
    overrides: {
        MuiButton: {
         root: {
          "&:hover": {
            boxShadow: 'rgba(0,0,0,0.25) 2px 3px 2px 0px',
          },
         }
        }
       },
       
    typography: {
        "fontFamily": `"Rubik", "Roboto", "Helvetica", "Arial", sans-serif`,
    },
    direction: 'rtl',
    palette: {
        primary: {
            main: 'rgba(0,0,0,0.5)'
        },
        secondary: {
            main: red['A700']
        },
        textPrimary: {
            main: 'rgba(255,255,255,0.8)'
        },
        textSecondary: {
            main: grey[100]
        }
    }
});