import {
	makeStyles,
	Grid,
	FormControl,
	Select,
	MenuItem,
	LinearProgress,
    IconButton,
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import React, { useState, useEffect, useContext } from 'react';
import {
	getFullAddress,
	getShortAddress,
	getUnit,
} from '../../../api/assetsApi';
import { LanguageContext } from '../../../context/LanguageContext';
import { FaultMinified } from '../faults/FaultMinified';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { useTranslation } from 'react-i18next';

export const MarkerData = ({ markersData, handleClose }) => {
	const classes = useStyles();
    const { lang } = useContext(LanguageContext);
    const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(markersData);
	const [faults, setFaults] = useState([]);
	const [selectedAsset, setSelectedAsset] = useState(null);

    useEffect(() => {
        if (data.length) {
            if (data.length > 1) {
                setSelectedAsset(data[0].asset._id);
                return;
            } 
            setSelectedAsset(null);
        }
    }, [data])

	useEffect(() => {
		if (markersData) {
            setFaults([]);   
			setData(markersData);
		}
	}, [markersData]);

	useEffect(() => {
		if (selectedAsset) {
            let item = data.find((md) => md.asset._id === selectedAsset);
            if (item) {
                setFaults(item.faults);  
            }
			return;
        }
        setFaults(data[0].faults)
	}, [selectedAsset]);

	const handleChange = (event) => {
		setSelectedAsset(event.target.value);
	};

	return (
		<div className={classes.container}>
            <IconButton onClick={handleClose} className={classes.closeBtn}>
                <ClearRoundedIcon />
            </IconButton>
			{Boolean(data.length) && (
				<div className={classes.streetName}>
					{data.length > 1
						? getShortAddress(data[0].asset)
						: getFullAddress(data[0].asset)}
				</div>
			)}
			{data.length > 1 && (
				<div className={classes.apartmentChooser}>
					<FormControl
						variant="outlined"
						className={classes.textInput}
					>
						<Select
							value={selectedAsset}
							onChange={handleChange}
							className={classes.menu}
							MenuProps={{
								classes: {
									paper: classes.menupaper,
								},
							}}
						>
							{data.map((md, i) => {
								return (
									<MenuItem
										className={classes.menuitem}
										value={md.asset._id}
										key={i}
										style={{
											direction:
												lang.code === 'he'
													? 'rtl'
													: 'ltr',
										}}
									>
										{getUnit(md.asset)}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>
			)}
			{faults.length ? (
				<div className={classes.faultContainer}>
					{faults.map((mdf, i) => {
						return (
							<div className={classes.miniFault}>
								<FaultMinified data={mdf} />
							</div>
						);
					})}
				</div>
			) : 
                <div className={classes.noFaults}>
                    {t("mapModule.noFaults")}
                </div>
            }
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
        width: '100%',
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        overflowY: 'overlay'
	},
	streetName: {
		fontSize: '24px',
		color: 'white',
		display: 'grid',
		background: 'rgba(0,0,0,0.6)',
		borderRadius: '5px',
		padding: '20px',
		margin: '10px',
		height: '60px',
		alignItems: 'flex-end',
	},
	miniFault: {
		height: '150px',
		padding: '10px',
		border: '0 solid rgba(255,255,255,0.2)',
		borderBottomWidth: '1px',
		background: 'rgba(0,0,0,0.4)',
		margin: '5px 0',
	},
	faultContainer: {
        borderBottom: '1px solid rgba(255,255,255,0.2)'
	},
	menu: {
		color: 'white',
		height: '50px',
		margin: '5px 50px 5px 10px',
		'&:hover': {
			borderColor: 'white',
		},
	},
	menupaper: {
		background: 'rgba(0,0,0,0.3)',
		backdropFilter: 'blur(10px)',
		border: '1px solid rgba(255,255,255,0.2)',
		maxHeight: '200px',
		overflowY: 'auto',
		marginTop: '60px',
		marginRight: '7px',
	},
	menuitem: {
		color: 'white',
	},
	textInput: {
		padding: '5px 0',
		background: 'rgba(0,0,0,0.4)',
		width: '100%',
		'& input': {
			color: 'white',
			paddingLeft: '20px',
		},
		'& label': {
			color: 'white',
			paddingLeft: '5px',
		},
		'& fieldset': {
			borderColor: 'rgba(255,255,255,0.6)',
			borderRadius: '42px',
		},
    },
    closeBtn: {
        color: 'white',
        alignSelf: 'flex-end',
        margin: '10px',
        position: 'absolute',
        '&:hover': {
            background: 'rgba(0,0,0,0.6)'
        }
    },
    noFaults: {
        color: 'white',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '50px',
        padding: '10px 20px',
        margin: '10px',
        fontSize: '14px'
    }
}));
