import React from 'react';
import { Grid, makeStyles, Paper, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Can } from '../../reuseables/Can';

export const SystemsHeader = () => {
	const classes = useStyles();
	const downSm = useMediaQuery((theme) => theme.breakpoints.down('md'));
	const { t, i18n } = useTranslation();

	return (
		<Grid item xs={12} sm={7} md={8} lg={11} lg={11}>
			<Paper elevation={9} className={classes.headerPaper}>
				<Grid container>
					<Grid item lg={4}>
						<div className={classes.systemName}>
							{t('systemsModule.systemName')}
						</div>
					</Grid>

					{!downSm && (
						<Grid item lg={8} className={classes.controller}>
							<Grid container style={{ height: '100%' }}>
								<Grid item lg={9}>
									<Grid
										container
										className={classes.actionsContainer}
									>
										<Grid item lg={2}>
											<div className={classes.iconHeader}>
												{t('systemsModule.moreDetails')}
											</div>
										</Grid>
										<Grid item lg={2}>
											<div className={classes.iconHeader}>
												{t('systemsModule.tasks')}
											</div>
										</Grid>
										<Grid item lg={2}>
											<div className={classes.iconHeader}>
												{t('systemsModule.faults')}
											</div>
										</Grid>
										<Grid item lg={2}>
											<div className={classes.iconHeader}>
												{t('systemsModule.documents')}
											</div>
										</Grid>
										<Can module='systems' action='changeRelatedUsers' userList={[]}>
										<Grid item lg={2}>
											<div className={classes.iconHeader}>
												{t(
													'systemsModule.changeOwner'
												)}
											</div>
										</Grid>
										</Can>
										
										<Grid item lg={2}>
											<div className={classes.iconHeader}>
												{t('systemsModule.users')}
											</div>{' '}
										</Grid>
										
									</Grid>
								</Grid>
                                <Grid item lg={3}>
											<div
												className={classes.ownerHeader}
											>
												{t('systemsModule.ownerHeader')}
											</div>
										</Grid>
							</Grid>
						</Grid>
					)}
				</Grid>
			</Paper>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	headerPaper: {
		height: '45px',
		background: 'rgba(0,0,0,0.7)',
		margin: '5px',
		borderRadius: '5px',
		color: 'white',
		display: 'flex',
		justifyContent: 'space-between',
		fontSize: '12px',
	},
	systemName: {
		margin: 'auto 20px',
        whiteSpace: 'nowrap',
        height: '100%',
        display: 'flex',
        alignItems: 'center'
	},
	actionsContainer: {
		display: 'flex',
		fontSize: '12px',
        justifyContent: 'flex-end',
        height: '100%',
        display: 'flex',
        alignItems: 'center'
	},
	iconHeader: {
		textAlign: 'center',
		margin: 'auto',
	},
	ownerHeader: {
		textAlign: 'center',
        margin: 'auto',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
		[theme.breakpoints.down('md')]: {
			margin: 'auto 0',
		},
    },
    controller: {
        padding: '5px'
    }
}));
