import {
	Grid, Link, makeStyles, useMediaQuery
} from "@material-ui/core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { getAddress, getSecondaryAddress } from "../../../api/assetsApi";
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import HomeIcon from '@material-ui/icons/Home';
import { AssetControls } from "./AssetControls";

export const Asset = ({ data }) => {
	const classes = useStyles();
	const history = useHistory();
	const { t } = useTranslation();
	const matches = useMediaQuery((theme) => theme.breakpoints.up("sm"));

	const handleReferralClick = (type) => (event) => {
		event.stopPropagation();
		history.push(`${type}?asset=${data._id}`);
	};

	return (
		<Grid item xs={12} sm={8} md={6} lg={5} xl={4} className={classes.mainContainer}>
				<div className={classes.imageContainer}
					style={{ 
						background: data.images.length ? `url(${data.images[0]})` : 'url(https://leevstore.blob.core.windows.net/images/dscn8142.jpg)',
						backgroundSize: 'cover'
						
					}}
				>
				</div>
				<div className={classes.dataContainer} onClick={() => history.push(`/workspace/assets/${data._id}`)}>
					<div className={classes.addressContainer}>
						<div className={classes.mainAddress}>
							{getAddress(data)}
						</div>
						<div className={classes.secondaryAddress}>
							{getSecondaryAddress(data)}
						</div>
						<div className={classes.zipCode}>
							{data.address.zipcode}
						</div>
					</div>
					<div className={classes.openFaults}>
						{`${data.faultCount} ${t("mapModule.openFaults")} `}
					</div>
					<AdditionalData data={data}/>
				</div>
				<div className={classes.controlsContainer}>
					<AssetControls data={data} />
				</div>
		</Grid>
		
	);
};

const AdditionalData = ({ data }) => {

	const classes = useStyles();
	const { t } = useTranslation();

	const type = data.type;
	
	const f = type === 'building' ? data.addInfo.floors : data.addInfo.floor;
	const ftype = type === 'building' ? 'floors' : 'floor';
	const u = type === 'building' ? data.addInfo.units : data.addInfo.unit;
	const utype = type === 'building' ? 'units' : 'unit';

	return (
		<div className={classes.moreInfo}>
			<HomeWorkIcon className={classes.icon} />
			<div className={classes.addInfoText}>
				{`${t(`assetsModule.${type}`)}`}
			</div>
			<VerticalSplitIcon className={classes.icon} />
			<div className={classes.addInfoText} style={{ display: 'flex', flexDirection: type === 'building' ? 'row' : 'row-reverse'}}>
				<span>{f}</span>
				&nbsp;
				<span>
					{`${t(`assetsModule.${ftype}`)}`}
				</span>	
			</div>
			<HomeIcon className={classes.icon} />
			<div className={classes.addInfoText} style={{ display: 'flex', flexDirection: type === 'building' ? 'row' : 'row-reverse'}}>
				<span>
					{u}
				</span>
				&nbsp;
				<span>
					{`${t(`assetsModule.${utype}`)}`}
				</span>
				
			</div>
		</div>
	)
}

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		height: '250px',
		margin: '20px',
		borderRadius: '5px 5px 30px 30px',
		position: 'relative',
		border: '1px solid rgba(255,255,255,0.2)',
		boxShadow: '0 0 5px 2px rgba(0,0,0,0.3)',
		[theme.breakpoints.down('sm')]: {
			margin : '10px 0',
			height: '200px',
			borderRadius: '0'
		}
	},
	imageContainer: {
		height: '250px',
		width: '100%',
		borderRadius: 'inherit',
		position: 'absolute',
		[theme.breakpoints.down('sm')]: {
			height: '200px'
		}	
	},
	dataContainer: {
		height: '250px',
		width: '100%',
		background: 'rgba(0,0,0,0.25)',
		backdropFilter: 'blur(0px)',
		borderRadius: 'inherit',
		cursor: 'pointer',
		[theme.breakpoints.down('sm')]: {
			height: '200px',
		}
	},
	addressContainer: {
		color: 'rgba(255,255,255,1)',
		padding: '30px',
		marginBottom: '20px',
		[theme.breakpoints.down('sm')]: {
			padding: '15px',
		}
	},
	mainAddress: {
		fontSize: '22px',
		fontWeight: '500',
		[theme.breakpoints.down('sm')]: {
			fontSize: '18px',
		}
	},
	secondaryAddress: {
		fontSize: '14px',
		[theme.breakpoints.down('sm')]: {
			fontSize: '12px',
		}
	},
	zipCode: {
		fontSize: '14px',
		[theme.breakpoints.down('sm')]: {
			fontSize: '12px',
		}
	},
	openFaults: {
		color: 'white',
		background: '#e53935',
		width: 'fit-content',
		padding: '7px 15px',
		borderRadius: '50px',
		margin: '0 30px',
		fontSize: '14px',
		[theme.breakpoints.down('sm')]: {
			margin: '10px 15px',
		}
	},
	moreInfo: {
		color: 'rgba(255,255,255,0.8)',
		padding: '7px 15px 7px 1px',
		fontSize: '14px',
		background: 'rgba(0,0,0,0.7)',
		width: 'fit-content',
		borderRadius: '50px',
		border: '1px solid white',
		margin: '10px 30px',
		display: 'flex',
		alignItems: 'center',
		[theme.breakpoints.down('sm')]: {
			margin: '10px 15px',
		}
	},
	icon: {
		fontSize: '16px',
		margin: '0 5px',
		border: '1px solid rgba(255,255,255,0.8)',
		borderRadius: '50px',
		padding: '3px',
		color: 'rgba(255,255,255,0.8)',
	},
	addInfoText: {
		lineHeight: '3px',
		padding: '0 10px 0 3px'
	},
	controlsContainer: {
		position: 'absolute',
		top: '20px',
		right: '20px'
	}
}));
