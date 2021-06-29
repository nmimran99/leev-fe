import React, { useEffect, useState } from "react";
import {
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	makeStyles,
	Paper,
} from "@material-ui/core";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { useTranslation } from "react-i18next";
import clsx from 'clsx'

export const DynamicTable = ({ rows, columns, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, Actions}) => {
	const classes = useStyles();
    const { t }= useTranslation();


	return (
		<TableContainer>
			<Table className={classes.table}>
				<TableHead>
					<TableRow className={clsx(classes.row, classes.headerRow)}>
						{
						
						columns.map((rh, ird) => {
							
								return (
									<TableCell component="th" scope="row" key={ird} className={classes.headerTh}>
										{t(`clientsModule.${rh}`)}
									</TableCell>
								);
							}
						)}
						
						{
                                Boolean(Actions) &&
                                <TableCell component="td" scope="row" className={classes.headerTh}>
										
                                </TableCell>
                            }
					</TableRow>
				</TableHead>
				<TableBody>
					{
					Boolean(rows.length) &&
					rows.map((row, ir) => (
						<TableRow key={ir}>
							{Object.entries(row).map((rd, rg) => {
								if (columns.includes(rd[0])) {
									return (
										<TableCell component="td" scope="row" className={classes.dataCell}>
											{rd[1]}
										</TableCell>
									);
								}
							})}
                            {
                                Boolean(Actions) &&
                                <TableCell component="td" scope="row" className={classes.dataCell}>
										<Actions data={row} />
                                </TableCell>
                            }
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow className={classes.paginationRow}>
						<TablePagination
							rowsPerPageOptions={[1, 5, 10, 25, { label: "All", value: -1 }]}
							count={rows.length}
							rowsPerPage={rowsPerPage}
							page={page}
							count={-1}
							SelectProps={{
								inputProps: { "aria-label": "rows per page" }
							}}
							onChangePage={handleChangePage}
							onChangeRowsPerPage={handleChangeRowsPerPage}
							ActionsComponent={TablePaginationActions}
                            labelDisplayedRows={({ from, to, count }) => `${t('clientsModule.displaying')} ${t('clientsModule.rows')} ${from} - ${to} `}
                            labelRowsPerPage={t('clientsModule.rowsPerPage')}
                            classes={{
                                root: classes.paginatroRoot
                            }}
						/>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	);
};

const useStyles = makeStyles((theme) => ({
    table: {
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.2)',
        margin: '20px 0'
    },
    headerTh: {
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        textAlign: 'center',
        border: 'none', 
    },
    headerRow: {
        borderRadius: '5px'
    },
    dataCell: {
        background: 'rgba(0,0,0,0.3)',
        color: 'white',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        textAlign: 'center'
    },
    paginationRow: {
        background: 'rgba(255,255,255,0.2)',
        color: 'white'
    },
    paginatroRoot: {
        border: 'none'
    }
}));
