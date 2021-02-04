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
            main: grey[900]
        },
        secondary: {
            main: red['A700']
        },
        textPrimary: {
            main: grey[900]
        },
        textSecondary: {
            main: grey[100]
        }
    }
});