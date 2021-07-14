import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Conversation } from './Conversation'
import { ConversationsContext } from "../../context/ConversationsContext";

export const Conversations = ({ setCurrent }) => {
	const classes = useStyles();
    const { conversations } = useContext(ConversationsContext);

	return (
		<div className={classes.mainContainer}>
            { 
            conversations &&
            conversations.map((c,i) => 
                <Conversation 
                key={i} 
                data={{...c}} 
                setCurrent={() => setCurrent(c)} />   
            )}

        </div>
	);
};

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: '100%',
        width: '100%',
        borderRadius: '20px',
        overflow: 'auto'
    }
}));
