import { CircularProgress, makeStyles } from "@material-ui/core";
import clsx from "clsx";

export const LoadingProgress = ({ initial }) => {
	const classes = useStyles();

	return (
    <div className={clsx(classes.mainContainer, initial ? classes.initial : null)}>
        <div className={classes.container}>
          <CircularProgress size={90} classes={{ colorPrimary: classes.rotateColor}} thickness={2} />
          <img src={'https://leevstore.blob.core.windows.net/images/leev_logo_round.png'} className={classes.logo}/>
      </div>
    </div>
    
		 
	);
};

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    height: 'calc(100vh - 64px)',
    width: 'calc(100vw - 60px)',
    background: 'rgba(0,0,0,0.5)',
    zIndex: 5000,
    top: 0,
    left: 0,
    position: 'absolute',
    display: 'grid',
    placeItems: 'center',
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100vh - 84px)',
      width: '100vw',
    }
  },
  initial: {
    height: '100vh',
    width: '100vw',
  },
  container: {
      animation: `$changeSizes 2500ms ${theme.transitions.easing.easeInOut} infinite`,
      display: 'grid',
      placeItems: 'center',
      height: 'fit-content',
      width: 'fit-content'
  },
  "@keyframes changeSizes": {
    "0%": {
      transform: "scale(1)"
    },
    "50%": {
      transform: "scale(1.15)"
    }
  },
  logo: {
    position: 'absolute',
    height: '78px',
    width: '78px'
  },
  rotateColor: {
    color: theme.palette.leading
  }
}));
