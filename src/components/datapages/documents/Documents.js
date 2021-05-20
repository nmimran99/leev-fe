import { Grid, LinearProgress, makeStyles } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import {
	getDocuments,
	deleteDocument,
	downloadDocument,
	updateDocumentDetails,
} from '../../../api/documentsApi';
import { getServerError, getSuccessMessage } from '../../../api/genericApi';
import { AuthContext } from '../../../context/AuthContext';
import { SnackbarContext } from '../../../context/SnackbarContext';
import { AlertDialog } from '../../reuseables/AlertDialog';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { Document } from './Document';
import { DocumentsControls } from './DocumentsControls';
import { UpsertDocument } from './UpsertDocument';

export const Documents = () => {
	const classes = useStyles();
	const location = useLocation();
	const query = useQuery(location.search);
	const { auth } = useContext(AuthContext);
	const { t } = useTranslation();
	const { setSnackbar } = useContext(SnackbarContext);
	const [docs, setDocs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [alertDialog, setAlertDialog] = useState(null);
	const [ edit, setEdit ] = useState(null)

	useEffect(() => {
		getDocuments(auth.user.tenant, query)
			.then((res) => {
				if (!res || res.status === 403) {
					return [];
				}
				if (res.status === 500) {
					setSnackbar(getServerError());
					return;
				}
				setDocs(res);
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

	const handleSave = (documentId, details) => {
		updateDocumentDetails(documentId, details)
		.then(res => {
			if (res.status === 403) {
				setSnackbar(res);
			} else if (res) {
				setDocs(docs.map(d => {
					if (d._id === res._id) {
						return res;
					}
					return d;
				}));
				setSnackbar(getSuccessMessage('document', res.docId, 'updated'));
			}
		})
		.finally(() => setEdit(null))
	}

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
				>
					{docs.map((d, i) => (
						<Grid item xs={12} sm={8} md={5} lg={4} xl={3} key={i}>
							<Document
								data={d}
								deleteFile={deleteFile}
								downloadFile={downloadFile}
								setEdit={setEdit}
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
			{
				edit &&
				<UpsertDocument 
					handleClose={() => setEdit(null)}
					handleSave={handleSave}
					documentId={edit}
				/>
			}
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
