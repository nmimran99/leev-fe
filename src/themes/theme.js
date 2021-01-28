import { createMuiTheme } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    overrides: {
        MuiButton: {
         root: {
          "&:hover": {
            boxShadow: 'rgba(0,0,0,0.5) inset 0px 0px 5px 1px',
            backgroundColor: 'rgba(0,0,0,0.2)'
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