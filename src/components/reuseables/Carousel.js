import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, Slide, Paper, IconButton } from '@material-ui/core'
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import clsx from 'clsx';
import { LanguageContext } from '../../context/LanguageContext';

export const Carousel = ({ images, isOpen, size }) => {
    
    const classes = useStyles();
    const [ slideIn, setSlideIn ] = useState(isOpen);
    const [ slideDirection, setSlideDirection ] = useState('left');
    const [ index, setIndex ] = useState(0);
    const { lang } = useContext(LanguageContext);

    const handleClick = dir => event => {
        setSlideDirection(dir);
        setSlideIn(false);
 
        setTimeout(() => {
            setIndex((index - (dir === 'left' ? 1 : -1) + images.length) % images.length);
            setSlideIn(true);
        }, 100)
    }

    return (
        <div className={classes.container}>
            <IconButton
                className={clsx(classes.arrow, classes.arrowLeft)}
                onClick={handleClick('left')}
                style={{ left: lang.drection === 'rtl' ? '100%' : '0%' }}
            >
                <ChevronLeftRoundedIcon className={classes.icon}/>
            </IconButton>
            <CarouselSlide image={images[index]} />
            <IconButton
                className={clsx(classes.arrow, classes.arrowRight)}
                onClick={handleClick('right')}
                style={{ right: lang.drection === 'rtl' ? '100%' : '0%' }}
            >
                <ChevronRightRoundedIcon className={classes.icon}/>
            </IconButton>
        </div>
    )
}

const CarouselSlide = ({image, size}) => {

    const classes = useStyles();

    return (
        <Paper className={classes.paper} elevation={0}>
            <img src={image} className={classes.image} style={{ height: size}}/>
        </Paper>   
    )
}

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        position: 'relative',
        width: '100%',
        justifyContent: 'center',
        padding: '10px 5px',
        borderRadius: '10px'
    },
    paper: {
        padding: 0,
        margin: 0,
        width: '100%',
        height: '300px',
        direction: 'ltr',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        maxHeight: '90%',
        maxWidth: '90%',
        borderRadius: '10px',
        objectFit: 'cover'
    },
    arrow: {
        position: 'absolute',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        zIndex: 1,
        padding: '5px',

    },
    arrowLeft: {
        top: '50%',
        transform: 'translateY(-50%)'
    },
    arrowRight: {
        top: '50%',
        transform: 'translateY(-50%)'
    },
    icon: {
        fontSize: '32px'
    }
}))