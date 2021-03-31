import { Grid, LinearProgress, makeStyles } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import {
	getDocuments,
	deleteDocument,
	downloadDocument,
} from '../../../api/documentsApi';
import { AuthContext } from '../../../context/AuthContext';
import { AlertDialog } from '../../reuseables/AlertDialog';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { Document } from './Document';
import { DocumentsControls } from './DocumentsControls';

export const Documents = () => {
	const classes = useStyles();
	const location = useLocation();
	const query = useQuery(location.search);
	const { auth } = useContext(AuthContext);
	const { t } = useTranslation();
	const [docs, setDocs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [alertDialog, setAlertDialog] = useState(null);

	useEffect(() => {
		getDocuments(auth.user.tenant, query)
			.then((data) => {
				console.log(data);
				setDocs(data);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [isLoading]);

	useEffect(() => {
		setIsLoading(true);
	}, [location.search]);

	const deleteFile = (documentId, desc) => (event) => {
		setAlertDialog({
			text: `${t('documentsModule.deleteFilePrompt')} "${desc}"?`,
			title: t('documentsModule.deleteFileTitle'),
			handleConfirm: async () => {
				const res = await deleteDocument(auth.user.tenant, documentId);
				if (res) {
					setDocs(docs.filter((d) => d._id !== res._id));
					setAlertDialog(null);
				}
			},
			handleCancel: () => setAlertDialog(null),
		});
	};

	const downloadFile = (url) => {
		downloadDocument(url);
	};

	return (
		<Grid container justify="center">
			<div className={classes.pageModule}>
				{t('documentsModule.documents')}
			</div>
			<Grid item xs={12}>
				<DocumentsControls />
			</Grid>
			{isLoading ? (
				<LinearProgress />
			) : (
				<Grid
					container
					justify="center"
					className={classes.docsContainer}
					spacing={2}
				>
					{docs.map((d, i) => (
						<Grid item xs={12} sm={8} md={5} lg={4} xl={3} key={i}>
							<Document
								data={d}
								deleteFile={deleteFile}
								downloadFile={downloadFile}
							/>
						</Grid>
					))}
				</Grid>
			)}
			{Boolean(alertDialog) && (
				<AlertDialog
					alertDialog={alertDialog}
					open={Boolean(alertDialog)}
				/>
			)}
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	pageModule: {
		color: 'white',
		padding: '10px 40px',
		fontSize: '18px',
		background: 'rgba(0,0,0,0.6)',
		margin: '0px auto 5px',
		width: '30%',
		textAlign: 'center',
		borderRadius: '0 0 25px 25px',
		lineHeight: '1',
	},
	docsContainer: {
		padding: '10px',
	},
}));
