import React, { useEffect, useState } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import { getDaysInMonth, getMonth, getYear, format } from "date-fns";
import { getBrackets } from "../../../api/calenderApi";
import { getTasks } from "../../../api/tasksApi";
import { CalenderHeaderRow } from "./CalenderHeaderRow";
import { CalenderRow } from "./CalenderRow";
import { useTranslation } from "react-i18next";

export const Calender = ({}) => {
	const classes = useStyles();
    const { t } = useTranslation();
	const [current, setCurrent] = useState({
		year: getYear(new Date()),
		month: getMonth(new Date()),
	});
	const [brackets, setBrackets] = useState([]);

	useEffect(() => {
		getTasks({ isRepeatable: true })
			.then((rts) => {
				return getBrackets(current, rts);
			})
			.then((data) => {
				setBrackets(data);
			});
	}, [current]);

	return (
		<Grid container className={classes.mainContainer} justify='center'>
            <div className={classes.pageModule}>
                    {t("calender.calender")}
            </div>
			<table className={classes.bracketsContainer}>
				<thead className={classes.tableHeader}>
					<CalenderHeaderRow />
				</thead>
				<tbody className={classes.tableBody}>
					{brackets.chunk(7).map((c, i) => 
						<CalenderRow brackets={c} key={i} />
					)}
				</tbody>
			</table>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
        height: 'calc(100vh - 64px)'
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
        lineHeight: '1'
    },
    bracketsContainer: {
        width: '90%',
        height: '90%',
        color: 'white'
    },
    tableBody: {
        background: 'rgba(0,0,0,0.4)',
    }
}));
