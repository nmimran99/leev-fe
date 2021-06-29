import { Grid, LinearProgress, makeStyles } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import {
	deleteDocument,
	downloadDocument, getDocuments,
	updateDocumentDetails
} from '../../../api/documentsApi';
import { getServerError, getSuccessMessage } from '../../../api/genericApi';
import { AuthContext } from '../../../context/AuthContext';
import { SnackbarContext } from '../../../context/SnackbarContext';
import { AlertDialog } from '../../reuseables/AlertDialog';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { Document } from './Document';
import { DocumentsControls } from './DocumentsControls';
import { UpsertDocument } from './UpsertDocument';
import { NoDataFound } from '../../reuseables/NoDataFound';

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
					setSnackbar(getSuccessMessage('document', res.docId, 'deleted'))
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
	
	const previewFile = file => {
		window.open(file.url)
	}

	return (
		<Grid container justify="center">
			<Grid xs={12} className={classes.moduleContainer}>
				<div className={classes.pageModule}>{t('documentsModule.documents')}</div>
			</Grid>
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
					{
					docs.length ? 
					docs.map((d, i) => (
						<Grid item xs={12} sm={8} md={5} lg={4} xl={3} key={i}>
							<Document
								data={d}
								deleteFile={deleteFile}
								downloadFile={downloadFile}
								setEdit={setEdit}
								previewFile={previewFile}
							/>
						</Grid>
					)) : 
					<NoDataFound />
					}
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
	moduleContainer: {
		position: 'sticky',
		top: 0,
		zIndex: 2
	},
	pageModule: {
		color: "white",
		padding: "10px 40px",
		fontSize: "16px",
		background: "rgba(0,0,0,0.8)",
        boxShadow: '0 0px 2px 1px rgba(255,255,255,0.3)',
		margin: "0px auto 5px",
		width: "30%",
		textAlign: "center",
		borderRadius: "0 0 25px 25px",
		lineHeight: "1", 
		[theme.breakpoints.down('md')]: {
			background: "black",
			width: "100vw",
			padding: "20px 0",
			borderRadius: 0,
			margin: 0
		}
	},
	docsContainer: {
		padding: '10px',
	},
}));
