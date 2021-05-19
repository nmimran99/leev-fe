import { Fade, Grid, LinearProgress, makeStyles } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { getTasks } from '../../../api/tasksApi';
import { AuthContext } from '../../../context/AuthContext';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { TaskMinified } from './TaskMinified';
import { TasksControls } from './TasksControls';

export const TasksList = ({ repeatable }) => {
	const classes = useStyles();
	const location = useLocation();
	const query = useQuery(location.search)
	const { auth } = useContext(AuthContext);
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(true);
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		getTasks({ ...query, isRepeatable: repeatable })
			.then((data) => {
				setTasks(data);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [isLoading]);

	useEffect(() => {
        setIsLoading(true)
    }, [location.search])

	return (
		<Grid container justify="center">
			<div className={classes.pageModule}>{repeatable ? t('tasksModule.repeatableTasks') : t('tasksModule.tasks')}</div>
			<Grid item xs={12}>
				<TasksControls />
			</Grid>
			{
				isLoading ?
                <LinearProgress />
				:
				<Fade in={!isLoading}>
					<Grid container className={classes.listContainer}>
						{tasks.map((task, i) => (					
							<TaskMinified data={task} key={i}/>
						))}
					</Grid>
				</Fade>
				
			}
			
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	listContainer: {
		padding: '10px',
		[theme.breakpoints.down('sm')]: {
			padding: '10px 0',
		},
	},
	miniTask: {
		background: 'rgba(0,0,0,0.6)',
	},
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
}));
