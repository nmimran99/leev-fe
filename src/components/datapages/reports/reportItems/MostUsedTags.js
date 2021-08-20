import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMostUsedTags } from "../../../../api/reportsApi";
import { LoadingProgress } from "../../../reuseables/LoadingProgress";

export const MostUsedTags = ({ data }) => {
	
    const classes = useStyles();
    const { t } = useTranslation();
    const [ tags, setTags ] = useState(null);

    useEffect(() => {
        prepareData()
    }, [])

    const prepareData = () => {
        let ts = getMostUsedTags(data);
        setTags(ts)
    };

	return (
        !tags ? 
        <LoadingProgress /> :
        <div className={classes.mainContainer}>
            <div className={classes.header}>
                {t("reportsModule.mostUsedTags")}
            </div>
            <div className={classes.tagsContainer}>
                {tags.map((t,i) => {
                    return (
                        <div className={classes.tag}>
                            <label className={classes.tagLabel}>{t.value}</label>
                            <div className={classes.tagCount}>{t.count}</div>
                        </div>
                    )
                })}
        </div>
        </div>
		
	);
};

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        background: 'rgba(0,0,0,0.4)',
        width: 'inherit',
        height: 'fit-content',
        borderRadius: '10px',
        padding: '20px',
        margin: '10px 0 10px auto',
    },
    tagsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px 0' 
    },
    tag: {
        display: 'flex',
        background: 'rgba(255,255,255,0.7)',
        width: 'fit-content',
        borderRadius: '50px',
        margin: '5px',
        padding: '5px',
        fontSize: '11px',
        height: 'fit-content',
        alignItems: 'center'
    },
    header: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '13px',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        padding: '5px'
    },
    tagCount: {
        width: '20px',
        height: '20px',
        background: 'white',
        borderRadius: '50px',
        textAlign: 'center',
        lineHeight: '1.8',
        color: 'black',
        fontSize: '12px',
        fontWeight: '600'
    },
    tagLabel: {
        lineHeight: '1.5',
        padding: '0 10px'
    }
}));
