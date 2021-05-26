import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, {
	FlyToInterpolator,
	Marker,
	setRTLTextPlugin,
} from 'react-map-gl';
import { makeStyles, IconButton, ClickAwayListener } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import useSupercluster from 'use-supercluster';
import { getMapData } from '../../../api/mapApi';
import { updateQueryParams } from '../../../api/genericApi';
import clsx from 'clsx';
import mapboxgl from "mapbox-gl";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

setRTLTextPlugin(
	// find out the latest version at https://www.npmjs.com/package/@mapbox/mapbox-gl-rtl-text
	'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
	null,
	// lazy: only load when the map first encounters Hebrew or Arabic text
	true
);

export const Mapbox = ({ data, setData }) => {
	const location = useLocation();
	const history = useHistory();
	const query = useQuery(location.search);
	const map = useRef();
	const classes = useStyles();
	const [mapData, setMapData] = useState(data);
	const [extId, setExtId] = useState(null);

	useEffect(() => {
		if (data) {
			setMapData(data);
		}
	}, [data]);

	const [viewport, setViewport] = useState({
		latitude: Number(query.lat),
		longitude: Number(query.lng),
		zoom: 10,
		width: 'auto',
		height: '100%'
	});

	const points = mapData.assets.map((asset, i) => ({
		type: 'Feature',
		properties: {
			cluster: false,
			asset,
		},
		geometry: {
			type: 'Point',
			coordinates: [asset.coordinates.lng, asset.coordinates.lat],
		},
	}));

	const bounds = map.current
		? map.current.getMap().getBounds().toArray().flat()
		: null;

	const { clusters, supercluster } = useSupercluster({
		points,
		zoom: viewport.zoom,
		bounds,
		options: {
			radius: 15,
			maxZoom: 20,
		},
	});

	const handleMarkerClick = (cluster) => (event) => {
		const { cluster: isCluster } = cluster.properties;
		setExtId(cluster.id);
		if (isCluster) {
			let leaves = getClusterLeaves(cluster.id);

			let reqData = leaves.map((lv) => {
				return {
					asset: lv.properties.asset,
					faults: mapData.faults.filter(
						(f) => f.asset._id === lv.properties.asset._id
					),
					tasks: mapData.tasks.filter(
						(t) => t.asset._id === lv.properties.asset._id
					),
				};
			});
			setData(reqData);
			return;
		}
		setData([
			{
				asset: cluster.properties.asset,
				faults: mapData.faults.filter(
					(f) => f.asset._id === cluster.properties.asset._id
				),
				tasks: mapData.tasks.filter(
					(t) => t.asset._id === cluster.properties.asset._id
				),
			},
		]);
	};

	const getClusterLeaves = (clusterId) => {
		return supercluster.getLeaves(clusterId);
	};

	return (
		<ReactMapGL
			ref={map}
			{...viewport}
			mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
			onViewportChange={(viewport) =>
				setViewport(viewport)
			}
			mapStyle={'mapbox://styles/nivmimran/ckngo7jr231jt18pcc4bzobs3'}
			attributionControl={false}
		>
			{clusters.map((cluster, i) => {
				const [longitude, latitude] = cluster.geometry.coordinates;
				const { cluster: isCluster } = cluster.properties;

				if (isCluster) {
					const leaves = getClusterLeaves(cluster.id);
					let totalFaults = 0;
					leaves.forEach((lv) => {
						totalFaults += lv.properties.asset.faultCount;
					});
					return (
						<Marker
							longitude={longitude}
							latitude={latitude}
							key={i}
							onClick={handleMarkerClick(cluster)}
						>
							{!!totalFaults && (
								<div className={classes.totalFaults}>
									{totalFaults}
								</div>
							)}
							<div
								className={clsx(
									classes.markerIcon,
									extId === cluster.id ? classes.active : null
								)}
							>
								<img src="https://img.icons8.com/nolan/30/skyscrapers.png" />
							</div>
						</Marker>
					);
				}
				return (
					<Marker
						longitude={longitude}
						latitude={latitude}
						key={i}
						onClick={handleMarkerClick(cluster)}
					>
						{Boolean(cluster.properties.asset.faultCount) && (
							<div className={classes.totalFaults}>
								{cluster.properties.asset.faultCount}
							</div>
						)}

						<div
							className={clsx(
								classes.markerIcon,
								extId === cluster.id ? classes.active : null
							)}
						>
							<img
								src={
									cluster.properties.asset.type ===
									'apartment'
										? 'https://img.icons8.com/nolan/30/cottage.png'
										: 'https://img.icons8.com/nolan/30/company.png'
								}
							/>
						</div>
					</Marker>
				);
			})}
		</ReactMapGL>
	);
};

const useStyles = makeStyles((theme) => ({
	totalFaults: {
		background: 'red',
		color: 'white',
		width: 'fit-content',
		height: 'fit-content',
		padding: '2px 5px',
		borderRadius: '50px',
		fontSize: '13px',
		position: 'relative',
		top: '15px',
		right: '10px'
	},
	markerIcon: {
		background: 'rgba(0,0,0,0.6)',
		borderRadius: '50px',
		padding: '3px 5px',
		border: '1px solid rgba(255,255,255,0.2)',
		cursor: 'pointer',
	},
}));
