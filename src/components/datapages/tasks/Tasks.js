import { Grid } from "@material-ui/core";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { TasksList } from "./TasksList";
import { TaskView } from "./TaskView";
import { TaskViews } from "./TaskViews";

export const Tasks = () => {
	const { path } = useRouteMatch();

	return (
		<Grid container justify="center">
			<Switch>
				<Route exact path={path}>
					<TaskViews />
				</Route>
				<Route path={`${path}/:taskId`}>
					<Grid item xl={6} lg={7} md={9} sm={11} xs={12}>
						<TaskView repeatable />
					</Grid>
				</Route>
			</Switch>
		</Grid>
	);
};
