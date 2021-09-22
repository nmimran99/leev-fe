import { Grid } from "@material-ui/core";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { FaultView } from "./FaultView";
import { FaultViews } from "./FaultViews";

export const Faults = () => {
	const { path } = useRouteMatch();

	return (
		<Grid container justify="center">
			<Switch>
				<Route exact path={path}>
					<FaultViews />
				</Route>
				<Route path={`${path}/:faultId`}>
					<Grid item xl={6} lg={7} md={9} sm={11} xs={12}>
						<FaultView />
					</Grid>
				</Route>
			</Switch>
		</Grid>
	);
};
