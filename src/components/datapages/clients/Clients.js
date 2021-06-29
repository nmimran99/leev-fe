import { Grid, responsiveFontSizes } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { getTenants } from "../../../api/adminApi";
import { DynamicTable } from "../../reuseables/DynamicTable";
import { ClientControls } from "./ClientControls";

export const Clients = () => {
	const { path } = useRouteMatch();
	const [isLoading, setIsLoading] = useState(false);
	const [rows, setRows] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	useEffect(() => {
		getTenants(page, rowsPerPage).then((res) => {
            console.log(responsiveFontSizes)
			setRows(res);
		});
	}, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    }

	return (
		<Grid container justify="center">
			<Grid item xs={12} xl={11}>
				<DynamicTable
					rows={rows}
					rowsPerPage={rowsPerPage}
					page={page}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
					columns={["_id", "name", "contactName", "contactNumber", "lang"]}
					Actions={ClientControls}
				/>
			</Grid>
		</Grid>
	);
};
