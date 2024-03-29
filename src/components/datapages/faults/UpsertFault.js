import {
	Avatar,
	Button,
	Chip,
	FormHelperText,
	Grid,
	IconButton,
	makeStyles,
	MenuItem,
	Select,
	TextField,
} from "@material-ui/core";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createTag, getFault, getFaultTagOptions } from "../../../api/faultsApi";
import { getFullName } from "../../../api/genericApi";
import {
	createLocationMenuOptions,
	getLocationsByAsset,
} from "../../../api/locationsApi";
import {
	createSystemMenuOptions,
	getAssetsSuggestions,
	getSystemsByAsset,
} from "../../../api/systemsApi";
import { createUserOptions } from "../../../api/userApi";
import { AuthContext } from "../../../context/AuthContext";
import { LanguageContext } from "../../../context/LanguageContext";
import { LoadingProgress } from "../../reuseables/LoadingProgress";
import { ModalContainer } from "../../reuseables/ModalContainer";
import { UserItem } from "../../user/UserItem";
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import clsx from 'clsx'
import AddIcon from '@material-ui/icons/Add';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';

export const UpsertFault = ({
	handleClose,
	handleSave,
	handleUpdate,
	faultId,
}) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { auth } = useContext(AuthContext);
	const { t } = useTranslation();
	const [mode, setMode] = useState(faultId ? "update" : "create");
	const [errors, setErrors] = useState([]);
	const [assets, setAssets] = useState([]);
	const [systems, setSystems] = useState([]);
	const [locations, setLocations] = useState([]);
	const [userList, setUserList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [tagValue, setTagValue] = useState("");
	const [tagOptions, setTagOptions] = useState([]);
	const [details, setDetails] = useState({
		tenant: auth.user.tenant,
		title: "",
		description: "",
		asset: "",
		system: "",
		location: "",
		owner: "",
		relatedUsers: [],
		createdBy: auth.user._id,
		images: [],
		uploadedImages: [],
		tags: []
	});

	useEffect(() => {
		prepareData();
	}, []);

	useEffect(() => {
		if (!tagValue) {
			setTagOptions([]);
			return;
		}
		getTagOptions();
	}, [tagValue]);

	const prepareData = async () => {
		const [userOptions, assetSuggestions] = await Promise.all([
			createUserOptions(),
			getAssetsSuggestions(),
		]);
		setUserList(userOptions);
		setAssets(assetSuggestions);
		if (!faultId) {
			setIsLoading(false);
			return;
		}
		const data = await getFault(faultId, true);
		await Promise.all([
			loadSystemOptions(data.asset),
			loadLocationOptions(data.asset),
		]);
		if (!data) return;
		setDetails({ ...data, images: [], uploadedImages: data.images });
		setIsLoading(false);
	};

	const validateFields = () => {
		return new Promise((resolve, reject) => {
			let errList = [];
			if (!details.owner) {
				errList.push({ field: "owner", text: t("errors.isRequired") });
			}
			if (!details.asset) {
				errList.push({ field: "asset", text: t("errors.isRequired") });
			}
			if (!details.system) {
				errList.push({ field: "system", text: t("errors.isRequired") });
			}
			if (!details.system) {
				errList.push({ field: "location", text: t("errors.isRequired") });
			}
			if (!details.title) {
				errList.push({ field: "title", text: t("errors.isRequired") });
			}

			if (errList.length) {
				setErrors(errList);
				resolve(false);
			}
			resolve(true);
		});
	};

	const loadSystemOptions = async (assetId) => {
		const systems = await getSystemsByAsset(assetId);
		const data = await createSystemMenuOptions(systems);
		setSystems(data);
		return true;
	};

	const loadLocationOptions = async (assetId) => {
		const locations = await getLocationsByAsset(assetId);
		const data = await createLocationMenuOptions(locations);
		setLocations(data);
		return true;
	};

	const handleConfirm = () => {
		validateFields().then((res) => {
			if (!res) return;
			let preped = {
				...details,
				tags: [...details.tags.map(t => t._id)]
			}
			if (mode === "update") {
				handleUpdate(preped);
			} else handleSave(preped);
		});
	};

	const handleChange = (field) => async (event) => {
		setDetails({
			...details,
			[field]: event.target.value,
		});
		if (field === "asset") {
			if (event.target.value) {
				await loadSystemOptions(event.target.value);
				await loadLocationOptions(event.target.value);
			} else {
				setDetails({
					...details,
					system: null,
				});
				setSystems([]);
			}
		}
		if (errors.length) {
			setErrors(errors.filter((err) => err.field !== field));
		}
	};

	const handleFileUpload = (event) => {
		setDetails({
			...details,
			images: event.target.files,
		});
	};

	const removeImage = (i) => (event) => {
		let im = details.uploadedImages;
		im.splice(i, 1);
		setDetails({ ...details, uploadedImages: im });
	};

	const handleTagValueChange = e => {
		let val = e.target.value;
		setTagValue(val);
	};

	const getTagOptions = async () => {
		const options = await getFaultTagOptions(faultId, tagValue);
		setTagOptions(options.filter(o => {
			let op = details.tags.find(dt => dt._id === o._id);
			if (!op) {
				return o
			}
		}))
	}

	const handleAddTag = tag => async event => {
		setTagOptions(tagOptions.filter(o => {
			return o._id !== tag._id
		}))
		setDetails({
			...details, 
			tags: [...details.tags, tag]
		})
		setTagValue('')
	}

	const handleRemoveTag = (tag) => event => {
		setDetails({
			...details, 
			tags: details.tags.filter(t => t._id !== tag._id)
		});
	}

	const createAndAddTag = async () => {
		const tag = await createTag(tagValue);
		if (tag) {
			setDetails({
				...details, 
				tags: [ ...details.tags, tag]
			});
		};
		setTagValue('');
	}

	return isLoading ? (
		<LoadingProgress initial={true} />
	) : (
		<ModalContainer
			handleClose={handleClose}
			title={
				mode === "update"
					? t("faultsModule.upsert.updateFaultDetails")
					: t("faultsModule.upsert.createFault")
			}
			handleConfirm={handleConfirm}
		>
			<Grid
				item
				xs={12}
				sm={10}
				md={10}
				lg={10}
				xl={10}
				className={classes.section}
			>
				<Grid item xs={12}>
					<div className={classes.sectionTitle}>
						{t("faultsModule.upsert.asset")}
					</div>
				</Grid>
				<Grid item xs={12} className={classes.fields}>
					<Grid container justify="flex-start">
						<Grid item xs={12} className={classes.textContainer}>
							<Select
								variant={"outlined"}
								error={errors.filter((e) => e.field === `asset`).length > 0}
								value={details.asset}
								onChange={handleChange(`asset`)}
								className={classes.selectInput}
								MenuProps={{
									anchorOrigin: {
										vertical: "bottom",
										horizontal: "center",
									},
									transformOrigin: {
										vertical: "top",
										horizontal: "center",
									},
									getContentAnchorEl: null,
									classes: {
										paper: classes.menupaper,
									},
								}}
							>
								{assets.map((asset, i) => (
									<MenuItem
										key={i}
										value={asset.value}
										style={{ direction: lang.dir }}
										className={classes.menuitem}
									>
										{asset.text}
									</MenuItem>
								))}
							</Select>
							{errors.filter((e) => e.field === "asset").length > 0 && (
								<FormHelperText
									style={{ color: "#f44336", marginRight: "15px" }}
								>
									{t("errors.isRequired")}
								</FormHelperText>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid
				item
				xs={12}
				sm={5}
				md={5}
				lg={5}
				xl={5}
				className={classes.section}
			>
				<Grid item xs={12}>
					<div className={classes.sectionTitle}>
						{t("faultsModule.upsert.system")}
					</div>
				</Grid>
				<Grid item xs={12} className={classes.fields}>
					<Grid container justify="flex-start">
						<Grid item xs={12} className={classes.textContainer}>
							<Select
								variant={"outlined"}
								error={errors.filter((e) => e.field === `system`).length > 0}
								value={details.system}
								onChange={handleChange(`system`)}
								className={classes.selectInput}
								MenuProps={{
									anchorOrigin: {
										vertical: "bottom",
										horizontal: "center",
									},
									transformOrigin: {
										vertical: "top",
										horizontal: "center",
									},
									getContentAnchorEl: null,
									classes: {
										paper: classes.menupaper,
									},
								}}
							>
								{systems.map((system, i) => (
									<MenuItem
										key={i}
										value={system.value}
										style={{ direction: lang.dir }}
										className={classes.menuitem}
									>
										{system.text}
									</MenuItem>
								))}
							</Select>
							{errors.filter((e) => e.field === "asset").length > 0 && (
								<FormHelperText
									style={{ color: "#f44336", marginRight: "15px" }}
								>
									{t("errors.isRequired")}
								</FormHelperText>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid
				item
				xs={12}
				sm={5}
				md={5}
				lg={5}
				xl={5}
				className={classes.section}
			>
				<Grid item xs={12}>
					<div className={classes.sectionTitle}>
						{t("faultsModule.upsert.location")}
					</div>
				</Grid>
				<Grid item xs={12} className={classes.fields}>
					<Grid container justify="flex-start">
						<Grid item xs={12} className={classes.textContainer}>
							<Select
								variant={"outlined"}
								error={errors.filter((e) => e.field === `location`).length > 0}
								value={details.location}
								onChange={handleChange(`location`)}
								className={classes.selectInput}
								MenuProps={{
									anchorOrigin: {
										vertical: "bottom",
										horizontal: "center",
									},
									transformOrigin: {
										vertical: "top",
										horizontal: "center",
									},
									getContentAnchorEl: null,
									classes: {
										paper: classes.menupaper,
									},
								}}
							>
								{locations.map((location, i) => (
									<MenuItem
										key={i}
										value={location.value}
										style={{ direction: lang.dir }}
										className={classes.menuitem}
									>
										{location.text}
									</MenuItem>
								))}
							</Select>
							{errors.filter((e) => e.field === "location").length > 0 && (
								<FormHelperText
									style={{ color: "#f44336", marginRight: "15px" }}
								>
									{t("errors.isRequired")}
								</FormHelperText>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} className={classes.section}>
				<Grid item xs={12}>
					<div className={classes.sectionTitle}>
						{t("faultsModule.upsert.generalDetails")}
					</div>
				</Grid>
				<Grid item xs={12} className={classes.fields}>
					<Grid container justify="flex-start">
						<Grid item xs={12} className={classes.textContainer}>
							<TextField
								variant={"outlined"}
								label={t(`faultsModule.upsert.title`)}
								error={errors.filter((e) => e.field === `title`).length > 0}
								value={details.title}
								onChange={handleChange("title")}
								className={classes.textField}
								size={"medium"}
								helperText={
									errors.filter((e) => e.field === `title`).length > 0
										? t("errors.isRequired")
										: `${60 - (details.title.length || 0)} ${t(
												"faultsModule.upsert.titleLimit"
										  )}`
								}
								inputProps={{
									maxLength: 60,
								}}
								FormHelperTextProps={{
									style: {
										color:
											errors.filter((e) => e.field === `title`).length > 0
												? "rgb(244, 67, 54)"
												: "rgba(255,255,255,0.6)",
									},
								}}
							/>
						</Grid>
						<Grid item xs={12} className={classes.textContainer}>
							<TextField
								variant={"outlined"}
								label={t(`faultsModule.upsert.description`)}
								value={details.description}
								onChange={handleChange("description")}
								className={classes.textField}
								size={"medium"}
								multiline={true}
								rows={7}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} className={classes.section}>
				<Grid item xs={12}>
					<div className={classes.sectionTitle}>
						{t("faultsModule.upsert.faultTags")}
					</div>
				</Grid>
				<Grid item xs={12} className={classes.fields}>
					<Grid container justify="flex-start">
						<Grid item xs={12} className={classes.textContainer}>
							<div className={classes.addTagExplain}>
								{t("faultsModule.upsert.addTagExplanation")}
							</div>
							<div className={classes.addTagRow}>
								<TextField
									variant={"outlined"}
									label={t(`faultsModule.upsert.describe`)}
									value={tagValue}
									onChange={handleTagValueChange}
									className={clsx(classes.textField, classes.tagValueInput)}
									size={"medium"}
									helperText={`${20 - (tagValue.length || 0)} ${t("faultsModule.upsert.titleLimit")}`}
									inputProps={{
										maxLength: 20,
									}}
									FormHelperTextProps={{
										style: {
											color: "rgba(255,255,255,0.6)",
										},
									}}
								/>
								<Button
									startIcon={<CheckCircleOutlinedIcon className={classes.addTagIcon} />}
									className={classes.addTagButton}
									disabled={!tagValue || tagOptions.length}
									onClick={createAndAddTag}
								>
									{t("faultsModule.addTag")}
								</Button>
							</div>
							{
								Boolean(tagOptions.length) &&
								<div className={classes.optionsContainer}>
									{
										tagOptions.map(to => 
											<Button className={classes.tagOptionBtn}
												startIcon={<AddIcon className={classes.icon}/>}
												onClick={handleAddTag(to)}
											>
												{to.value}
											</Button>
										)
									}
								</div>
							}
							<div className={classes.tagList}>
							{
								details.tags.length ? 
								details.tags.map((tag) => 
									<div className={classes.tag} key={tag._id} >
										{tag.value}
										<ClearOutlinedIcon className={classes.removeTagIcon} onClick={handleRemoveTag(tag)} />
									</div>
								) : 
								<div className={classes.noTags}>
									{t("faultsModule.upsert.noTags")}
								</div>
							}
							</div>	
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid
				item
				xs={12}
				sm={6}
				md={6}
				lg={4}
				xl={4}
				className={classes.section}
			>
				<Grid item xs={12}>
					<div className={classes.sectionTitle}>
						{t("faultsModule.upsert.faultOwner")}
					</div>
				</Grid>
				<Grid item xs={12} className={classes.fields}>
					<Grid item xs={12} className={classes.textContainer}>
						<Select
							variant={"outlined"}
							error={errors.filter((e) => e.field === `owner`).length > 0}
							value={details.owner}
							onChange={handleChange(`owner`)}
							className={classes.selectInput}
							MenuProps={{
								anchorOrigin: {
									vertical: "bottom",
									horizontal: "center",
								},
								transformOrigin: {
									vertical: "top",
									horizontal: "center",
								},
								getContentAnchorEl: null,
								classes: {
									paper: classes.menupaper,
								},
							}}
							renderValue={(selected) => {
								let user = userList.find((f) => f._id === selected);
								return (
									<Chip
										size={"medium"}
										avatar={
											<Avatar
												style={{ height: "40px", width: "40px" }}
												src={user.avatar}
											/>
										}
										label={getFullName(user)}
										className={classes.chip}
									/>
								);
							}}
						>
							{userList.map((user, i) => (
								<MenuItem
									key={i}
									value={user.value}
									style={{ direction: lang.dir }}
									className={classes.menuitem}
								>
									<div className={classes.userCont}>
										<UserItem user={user} avatarSize={40} size={13} showName />
									</div>
								</MenuItem>
							))}
						</Select>
						{errors.filter((e) => e.field === "owner").length > 0 && (
							<FormHelperText style={{ color: "#f44336", marginRight: "15px" }}>
								{t("errors.isRequired")}
							</FormHelperText>
						)}
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12} md={6} className={classes.section}>
				<Grid item xs={12}>
					<div className={classes.sectionTitle}>
						{mode === "create"
							? t("faultsModule.upsert.faultImages")
							: t("faultsModule.upsert.addFaultImages")}
					</div>
				</Grid>
				<Grid item xs={12} className={classes.fields}>
					<Grid container justify="flex-start">
						<Grid item xs={12} className={classes.textContainer}>
							<Button
								component={"label"}
								variant={"contained"}
								className={classes.uploadBtn}
							>
								{t("faultsModule.upsert.uploadImages")}
								<input
									accepts="image/*"
									type="file"
									multiple
									onChange={handleFileUpload}
									hidden
								/>
							</Button>
							<span className={classes.filesUploaded}>
								{`${details.images.length} ${t(
									"faultsModule.upsert.imagesSelected"
								)}`}
							</span>
						</Grid>
						{Boolean(details.uploadedImages.length) && (
							<React.Fragment>
								<Grid item xs={12} className={classes.uploadedImagesTitle}>
									{t("faultsModule.upsert.uploadedImages")}
								</Grid>
								{details.uploadedImages.map((image, i) => (
									<Grid item xs={12} className={classes.imageRow} key={i}>
										<img src={image} className={classes.previewImage} />
										<IconButton
											onClick={removeImage(i)}
											className={classes.removeImageBtn}
										>
											<DeleteOutlineRoundedIcon
												className={classes.removeImage}
											/>
										</IconButton>
									</Grid>
								))}
							</React.Fragment>
						)}
					</Grid>
				</Grid>
			</Grid>
		</ModalContainer>
	);
};

const useStyles = makeStyles((theme) => ({
	iconBtn: {
		margin: "10px",
		"&:hover": {
			background: "rgba(0,0,0,0.3)",
		},
	},
	icon: {
		color: "white",
		fontSize: "20px",
	},
	section: {
		margin: "10px 5px",
	},
	sectionTitle: {
		color: "white",
		fontSize: "16px",
		padding: "7px 20px",
		marginLeft: "25px",
		width: "fit-content",
		borderRadius: "8px",
		whiteSpace: "nowrap",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
		[theme.breakpoints.down("sm")]: {
			marginLeft: "15px",
		},
	},
	fields: {
		padding: "10px 20px",
		[theme.breakpoints.down("sm")]: {
			padding: "10px",
		},
	},
	textContainer: {
		padding: "5px",
	},
	textField: {
		width: "100%",
		"& fieldset": {
			borderRadius: "5px",
		},
	},
	selectInput: {
		width: "100%",
		"& fieldset": {
			borderRadius: "5px",
		},
	},
	menupaper: {
		background: "rgba(0,0,0,0.8)",
		backdropFilter: "blur(10px)",
		height: "200px",
		overflowY: "auto",
		border: "1px solid rgba(255,255,255,0.2)",
		marginRight: "7px",
		marginLeft: "-5px",
	},
	menuitem: {
		color: "white",
		width: "100%",
		"&:hover": {
			background: "rgba(255,255,255,0.1)",
		},
	},
	controls: {
		borderTop: "1px solid rgba(255,255,255,0.2)",
		padding: "10px 0",
		display: "flex",
		justifyContent: "space-between",
	},
	control: {
		width: "30%",
		border: "1px solid rgba(255,255,255,0.5)",
		fontSize: "16px",
		margin: "5px",
		padding: "5px 30px",
		borderRadius: "30px",
		color: "white",
	},
	save: {
		background: "rgba(0,0,0,0.2)",
		"&:hover": {
			background: "black",
		},
		"&:disabled": {
			color: "rgba(255,255,255,0.3)",
		},
	},
	cancel: {
		"&:hover": {
			boxShadow: "inset rgba(255,255,255,0.3) 0 0 2px 1px",
		},
	},
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		height: "50px",
		fontSize: "14px",
		borderRadius: "50px",
		display: "flex",
		justifyContent: "flex-start",
		color: "white",
		border: "1px solid rgba(255,255,255,0.2)",
		background: "rgba(0,0,0,0.6)",
		"&:hover": {
			background: "rgba(0,0,0,0.6)",
			boxShadow: "inset lightgrey 0px 0px 1px 1px",
		},
	},
	userCont: {
		height: "fit-content",
		padding: 0,
		margin: 0,
		margin: "5px 0",
	},
	chipsCont: {
		height: "fit-content",
		padding: 0,
		margin: "3px",
		borderRadius: "50px",
		background: "rgba(255,255,255,0.1)",
		boxShadow: "inset rgba(0,0,0,0.5) 0px 0px 2px 1px",
		display: "flex",
		jutifyContent: "space-between",
		alignItems: "center",
	},
	removeIcon: {
		color: "rgba(255,255,255,0.2)",
		padding: "5px",
		marginRight: "5px",
		borderRadius: "50px",
		"&:hover": {
			background: "rgba(0,0,0,0.8)",
			color: "white",
		},
	},
	radioGroup: {
		color: "white",
		display: "flex",
		flexDirection: "row",
		alignitems: "center",
	},
	radioBtn: {
		color: "white",
		padding: "15px",
	},
	filesUploaded: {
		color: "white",
		padding: "0 15px",
	},
	uploadBtn: {
		margin: "9px 0",
		background: "rgba(0,0,0,0.1)",
		color: "white",
		border: "1px solid rgba(255,255,255,0.2)",
		borderRadius: "50px",
		whiteSpace: "nowrap",
		"&:hover": {
			boxShadow: "inset white 0 0 2px 1px",
			background: "rgba(0,0,0,0.3)",
		},
	},
	imageRow: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "10px 5px",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	previewImage: {
		height: "50px",
		width: "100px",
	},
	removeImageBtn: {
		color: "rgba(255,255,255,0.5)",
		border: "1px solid rgba(255,255,255,0.5)",
		borderRadius: "50px",
		padding: "6px",
		"&:hover": {
			color: "white",
			borderColor: "white",
		},
	},
	uploadedImagesTitle: {
		color: "white",
		padding: "10px 5px",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	addTagExplain: {
		fontSize: '12px',
		color: 'rgba(255,255,255,0.6)',
		marginBottom: '8px'
	},
	addTagRow: {
		display: 'flex'
	},
	tagValueInput: {
		width: '60%',
		[theme.breakpoints.down('sm')]: {
			width: '75%',
		}
	},
	addTagButton: {
		width: 'fit-content',
		color: 'white',
		height: '35px',
		borderRadius: '50px',
		padding: '5px 20px 5px 10px',
		fontSize: '13px',
		margin: '10px',
		border: '1px solid rgba(255,255,255,0.2)'
	},
	addTagIcon: {
		fontSize: '24px'
	},
	tagList: {
		padding: '10px',
		borderRadius: '5px',
		display: 'flex',
		flexWrap: 'wrap'
	},
	noTags: {
		border: '1px solid rgba(255,255,255,0.5)',
		color: 'white',
		fontSize: '12px',
		width: 'fit-content',
		height: '22px',
		borderRadius: '50px',
		padding: '3px 10px',
		lineHeight: 1.8
	},
	tag: {
		background: 'rgba(255,255,255,0.5)',
		borderRadius: '50px',
		padding: '0px 10px',
		display: 'grid',
		placeItems: 'center',
		fontSize: '12px',
		margin: '4px 3px',
		height: '22px',
		color: 'black',
		lineHeight: 1,
		width: 'fit-content',
		display: 'flex'
	},
	optionsContainer: {
		background: 'rgba(0,0,0,0.4)',
		width: '60%',
		display: 'flex',
		borderRadius: '5px',
		padding: '10px',
		flexFlow: 'wrap',
		[theme.breakpoints.down('sm')]: {
			width: '90%',
		}
	},
	tagOptionBtn: {
		background: 'rgba(255,255,255,0.4)',
		borderRadius: '50px',
		margin: '3px',
		fontSize: '13px',
		padding: '3px 20px 3px 10px',
		color: 'white',
		'&:hover': {
			background: theme.palette.leading,
		}
	},
	removeTagIcon: {
		fontSize: '14px',
		color: 'rgba(0,0,0,0.5)',
		padding: '0 0 0 5px'
	}
}));
