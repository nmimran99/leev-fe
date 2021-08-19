import { ClickAwayListener, makeStyles, useMediaQuery, Slide } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ConversationsContext } from "../../context/ConversationsContext";
import { useSocket } from "../reuseables/customHooks/useSocket";
import { Conversations } from "./Conversations";
import { MainConversation } from "./MainConversation";
import { Topbar } from "./Topbar";
import { NewMessage } from "./NewMessage";
import { countUnreadMessages, createNewConversation } from "../../api/messengerApi";
import { SnackbarContext } from "../../context/SnackbarContext";
import { getServerError } from "../../api/genericApi";

export const Messenger = ({ toggleMessenger }) => {
	const classes = useStyles();
	const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
	const { socket } = useSocket();
	const { auth } = useContext(AuthContext);
	const { conversations, setConversations } = useContext(ConversationsContext);
	const { setSnackbar } = useContext(SnackbarContext);
	const [ newMessage, setNewMessage ] = useState(false);
	const [current, setCurrent] = useState(null);

    useEffect(() => {
		if (current) {
			const nc = conversations.find(c => c._id === current._id);
        	setCurrent({...nc});
			return;
		}      
    }, [conversations]);

	useEffect(() => {
		if (!current) return;
		let messageCount = countUnreadMessages(current.messages, auth.user._id);
		if (messageCount > 0) {
			readAllMessages();
		}
	}, [current])

	const sendMessage = (value) => {
		socket.emit("send-message", {
			tenant: auth.user.tenant,
			text: value,
			from: auth.user._id,
            to: current.participant,
            conversation: current._id
		});
	};

	const toggleNewMessage = () => {
		if (newMessage) {
			setNewMessage(false);
			return;
		} 
		setNewMessage(true);
	}


	const startNewConversation = async (userId) => {
		let exists = conversations.find(c => c.participant._id === userId);
		if(exists) {
			setCurrent(exists);
			setNewMessage(false);
			return;
		};
		const { tenant, _id } = auth.user;
		const res = await createNewConversation(tenant, [_id, userId], 'private');
		if (res.error) {
			setSnackbar(res);
			return;
		};
		let conv = { ...res, participant: res.participants.filter(p => p._id != auth.user._id )[0]};
		socket.emit('create-conversation', { conversationId: conv._id });
		setConversations([conv, ...conversations]);
		setCurrent(conv);
		setNewMessage(false);
	}

	const readAllMessages = () => {
		socket.emit("read-messages", {conversationId: current._id, sender: current.participant._id });
	}

	return (
		<ClickAwayListener onClickAway={toggleMessenger}>
			<div className={classes.mainContainer}>
			<Slide in={downSm ? !Boolean(current) : true} timeout={downSm ? 300 : 0} direction={'left'}>
				<div className={classes.leftContainer}>
					<div className={classes.topBar}>
						<Topbar toggleNewMessage={toggleNewMessage} toggleMessenger={toggleMessenger} />
					</div>
						<div className={classes.conversations}>
							<Conversations setCurrent={setCurrent} />
						</div>
						<NewMessage toggleNewMessage={toggleNewMessage} open={newMessage} startNewConversation={startNewConversation} /> 
				</div>
				</Slide>
				<Slide in={downSm ? Boolean(current) : true} timeout={downSm ? 300 : 0} direction={'right'}>
				<div className={classes.rightContainer}>
					{
						current &&
						<MainConversation setCurrent={setCurrent} current={current} sendMessage={sendMessage} readAllMessages={readAllMessages}/>
					}
					
				</div>
				</Slide>
			</div>
		</ClickAwayListener>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		width: "70vw",
		height: "70vh",
		zIndex: 3,
		position: "absolute",
		background: "white",
		top: "70px",
		right: "60px",
		borderRadius: "20px",
		background: "rgba(0,0,0,0.5)",
		backdropFilter: "blur(15px)",
		display: "flex",
		border: '1px solid rgba(255,255,255,0.2)',
		boxShadow: '0 0 10px 3px rgba(0,0,0,0.4)',
		[theme.breakpoints.down('md')]: {
			width: "90vw",
			height: "80vh",
		},
		[theme.breakpoints.down('sm')]: {
			width: "100%",
			height: "100%",
			top: "0",
			right: "0",
			borderRadius: "0",
			border: 'none',
		}
	},
	leftContainer: {
		width: "30%",
		height: "100%",
		background: "rgba(0,0,0,0.4)",
		borderRadius: "20px 0 0 20px",
		position: 'relative',
		overflow: 'hidden',
		[theme.breakpoints.down('sm')]: {
			width: '100%',
			height: '100%'
		}
	},
	topBar: {
		height: "50px",
		width: "100%",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	conversations: {
		width: "100%",
		height: "calc(100% - 50px)",
	},
	rightContainer: {
		width: "70%",
		height: "100%",
		borderRadius: "0 20px 20px 0",
		[theme.breakpoints.down('sm')]: {
			width: '100%',
			height: '100%',
			position: 'absolute',
			borderRadius: "0",
			overflow: 'hidden'
		}
	},
}));
