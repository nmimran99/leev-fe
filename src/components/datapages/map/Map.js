import { makeStyles, IconButton, ClickAwayListener } from '@material-ui/core';
import {
	GoogleMap,
	InfoWindow,
	InfoBox,
	Marker,
	useJsApiLoader,
	MarkerClusterer,
} from '@react-google-maps/api';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { addQueryParam } from '../../../api/genericApi';
import { getMapData } from '../../../api/mapApi';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import house from '../../../assets/icons/house.png';
import { FaultMinified } from '../faults/FaultMinified';
import { getFullAddress } from '../../../api/assetsApi';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import { useTranslation } from 'react-i18next';

const containerStyle = {
	width: '100%',
	height: '100%',
	borderRadius: '5px',
};

export const Map = ({ setData }) => {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	const query = useQuery(location.search);
	const { t } = useTranslation();
	const [map, setMap] = useState(null);
	const [mapData, setMapData] = useState({});
	const [markers, setMarkers] = useState([]);

	useEffect(() => {
		console.log(mapData);
		if (mapData.assets) {
			setMarkers(mapData.assets);
		}
	}, [mapData]);

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
		language: 'he',
		region: 'IL',
	});

	const onLoad = React.useCallback(function callback(map) {
		setMap(map);
		fetchMapData();
	}, []);

	const onDragEnd = () => {
		const lat = map.getCenter().lat();
		const lng = map.getCenter().lng();
		history.push({
			path: location.pathname,
			search: addQueryParam(location.search, [
				{ name: 'lat', value: lat },
				{ name: 'lng', value: lng },
			]),
		});
		localStorage.setItem('wb_map_pref', JSON.stringify({ lat, lng }));
	};

	const fetchMapData = async () => {
		const data = await getMapData();
		setMapData(data);
	};

	const handleMarkerClick = (asset, index) => (event) => {
		let fs = mapData.faults.filter((f) => f.asset._id == asset._id);
		setData([{ asset, faults: fs }]);
	};

	const handleClusterClick = (cluster) => {
		const markers = cluster.getMarkers();
		let md = [];
		markers.forEach(m => {
			let fs = mapData.faults.filter((f) => f.asset._id == m.data._id);
			md.push({asset: m.data, faults: fs});
		});
		setData(md);
	}

	return isLoaded ? (
		<GoogleMap
			mapContainerStyle={containerStyle}
			zoom={15}
			onLoad={onLoad}
			onDragEnd={onDragEnd}
			center={{ lat: Number(query.lat), lng: Number(query.lng) }}
			options={{
				maxZoom: 18,
				fullscreenControl: false,
				streetViewControl: false,
				mapTypeControl: false,
				gestureHandling: 'greedy',
				styles: [
					{
						featureType: 'poi',
						stylers: [{ visibility: 'off' }],
					},
					{
						featureType: 'transit',
						elementType: 'labels.icon',
						stylers: [{ visibility: 'off' }],
					},
				],
			}}
		>
			<MarkerClusterer
				onClick={handleClusterClick}
				gridSize={30}
				enableRetinaIcons
				clusterClass={classes.mcLabel}
				zoomOnClick={false}
				styles={[
					{	
						textColor: 'white',
						fontWeight: '500',
						textSize: 12,
						width: 20,
						height: 20,
						anchorText: [0,0],
						url: 'https://img.icons8.com/nolan/50/company.png',
					},
				]}
			>
				{(clusterer) => {
					return markers.map((marker, i) => {
						return (
							<Marker
								key={i}
								options={{
									data: marker
								}}
								label={{
									
									text: marker.faultCount.toString(),
									className: classes.markerLabel,
									color: 'white',
									fontSize: '11px'
								}}
								icon={
									'https://img.icons8.com/nolan/50/marker.png'
								}
								position={{
									lat: marker.coordinates.lat,
									lng: marker.coordinates.lng,
								}}
								onClick={handleMarkerClick(marker, i)}
								clusterer={clusterer}
							/>
						);
					});
					return;
				}}
			</MarkerClusterer>
		</GoogleMap>
	) : null;
};

const useStyles = makeStyles((theme) => ({
	mapFull: {
		width: '100%',
		height: '100%',
		borderRadius: '10px',
		'&div': {
			outline: 'none !important',
		},
	},
	markerLabel: {
		background: 'red',
		padding: '5px 6px',
		borderRadius: '50px',
		lineHeight: '0.9',
		position: 'absolute',
		right: '4px',
		top: '20px',
	},
	faultInfo: {
		background: 'rgba(0,0,0,0.4)',
		backdropFilter: 'blur(10px)',
		borderRadius: '5px',
		width: '300px',
		padding: '10px',
		maxHeight: '400px',
		overflowY: 'overlay',
	},
	faultContainer: {
		background: 'rgba(0,0,0,0.6)',
		margin: '5px 0',
		padding: '10px',
		borderRadius: '5px',
	},
	address: {
		color: 'white',
		background: 'black',
		fontSize: '18px',
		padding: '15px',
		borderRadius: '5px',
	},
	cardPagination: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	arrow: {
		color: 'white',
	},
	paginationMiddle: {
		color: 'white',
		display: 'grid',
		placeItems: 'center',
		fontSize: '14px',
	},
	'@global': {
		'*': {
			outline: 'none',
		},
	},
	mcLabel: {
		background: 'red',
		borderRadius: '50px',
		opacity: '0.8'
	}
}));
