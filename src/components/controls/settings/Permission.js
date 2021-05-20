import React, { useEffect, useState } from 'react';
import { makeStyles, Grid, Slider } from '@material-ui/core';
import { useTranslation } from 'react-i18next';




export const Permission = ({ isBoolean, module, text, value, handleValueChange}) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const [ val, setVal ] = useState(value)  

    useEffect(() => {
        handleValueChange(module, text, val)
    }, [val])

    const marks = [
        {
            value: 0,
            label: t(`roles.noPermission`)
        },
        {
            value: 1,
            label: t(`roles.onlyMe`)
        },
        {
            value: 2,
            label: t(`roles.mineAndOthers`)
        }
    ]

    const marksPoints = marks.map(m => {
        if (isBoolean && m.value === 1) {
            return false;
        }
        return m;
    })

    const getValColor = (val) => {
        return { 0: 'red', 1: 'yellow', 2: 'green' }[val]
    }

   function textValue(v){
       return marksPoints[v].label
   }

   const handleChange = (e,v) => {
       setVal(v)
   }
    
    return (
        <Grid container className={classes.container} justify='center'>
            <Grid item xs={12} className={classes.permText}>
                <div className={classes.permTextLabel}>
                    {t(`roles.${text}`)}
                </div>
                
            </Grid>
            <Grid item xs={11} lg={7} className={classes.gridItem}>
                <div className={classes.sliderContainer}>
                    <Slider
                        track={false}
                        value={val}
                        getAriaValueText={textValue}
                        aria-labelledby="discrete-slider-small-steps"
                        step={isBoolean ? 2 : 1}
                        marks={marksPoints}
                        min={0}
                        max={2}
                        valueLabelDisplay="off"
                        classes={{
                            root: classes.rootSlider,
                            track: classes.track,
                            rail: classes.rail,
                            mark: classes.mark,
                            markLabelActive: classes.markLabelActive,
                            thumb: classes.thumb
                        }}
                        onChange={handleChange}
                    />
                </div>
            
            </Grid>
        </Grid>
    )
}

const useStyles = makeStyles(theme => ({
    container: {
        padding: '10px 0px 20px',
        border: '1px solid rgba(255,255,255,0.2)',
        margin: '10px 0',
        borderRadius: '5px',
        [theme.breakpoints.down('sm')] :{
            padding: '0px 0px 30px',
            borderWidth: '0px 0px 1px',
        }
    },
    gridItem: {
       padding: '10px',
       [theme.breakpoints.down('sm')] :{
        padding: '10px 40px',
    }
    },
    permTextLabel: {
        padding: '10px 20px',

        width: 'auto',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
    },

    permText: {
        color: 'white',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'flex-start',
       
        paddingBottom: '10px'
    },
    sliderContainer: {
       
    },
    rootSlider: {
        color: 'white'
    },
    mark: {
        color: 'rgba(255,255,255,0.6)',
        height: '20px',
        width: '2px'
    },
    rail: {
        color: 'rgba(255,255,255,0.6)',
        opacity: '1',

    },
    markLabelActive: { 
        color: 'white',
        padding: '5px 20px',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50px' ,
        margin: '10px 0'
    },
    thumb: {
        color: 'white'
    }
}))