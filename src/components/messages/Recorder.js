import { IconButton, makeStyles, useMediaQuery } from "@material-ui/core";
import React, { useContext, useState, useEffect } from "react";
import { EnvContext } from "../../context/EnvContext";
import { LanguageContext } from "../../context/LanguageContext";
import MicNoneRoundedIcon from "@material-ui/icons/MicNoneRounded";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import clsx from "clsx";
import { blobToFile } from '../../api/messengerApi';

export const Recorder = ({recording, setRecording, handleRecordedMessage }) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
    const [ mediaRecorder, setMediaRecorder ] = useState(null);
    const [ chunks, setChunks ] = useState([]);

    useEffect(() => {
		if (mediaRecorder) {
			mediaRecorder.start();
		}
	}, [mediaRecorder])
    
	useEffect(() => {
		if (recording) {
			handleStartRecording();
		} else {
			setMediaRecorder(null)
		}
	}, [recording])

    useEffect(() => {
        if (chunks.length) {
            const blob = new Blob(chunks, { type: 'audio/mpeg-3'});
            handleRecordedMessage(blob)
        }
    }, [chunks])

    
	const toggleRecording = () => {
		if (recording) {
			mediaRecorder.stop();
			mediaRecorder.stream.getTracks()[0].stop();
            setRecording(false);
            return;
        }
        setRecording(true)
	};

    const handleStartRecording = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
		const mr = new MediaRecorder(stream)
        const audioContext = new AudioContext();
		mr.ondataavailable = (e) => {
			if (e.data.size > 0) {
				setChunks([e.data]) 
			}
		};

		mr.onstop = () => {
			console.log('stopped');
		}


		setMediaRecorder(mr)
	}

    const stopRecording = () => {
        mediaRecorder.stream.getTracks()[0].stop();
        setMediaRecorder(null);
    }

    const submitRecording = () => {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks()[0].stop();
        setRecording(false);
    }

	return recording ? (
		<div className={classes.recorderContainer}>
			<IconButton className={clsx(classes.btn, classes.submitRecording)} onClick={submitRecording}>
				<CheckRoundedIcon
					className={clsx(
						classes.icon,  
						lang.dir === "rtl" ? classes.mirror : null
					)}
				/>
			</IconButton>
            <div className={classes.recordCounter}>
                <div className={classes.text}>
                        00:00
                </div>
                <MicNoneRoundedIcon className={classes.blinkingMic}
                />
            </div>
			<IconButton className={clsx(classes.btn,classes.stopdButton)} onClick={stopRecording}>
				<StopRoundedIcon
					className={clsx(
						classes.icon,
						lang.dir === "rtl" ? classes.mirror : null
					)}
				/>
			</IconButton>
		</div>
	) : (
		<IconButton className={classes.btn} onClick={toggleRecording}>
			<MicNoneRoundedIcon
				className={clsx(
					classes.icon,
					lang.dir === "rtl" ? classes.mirror : null
				)}
			/>
		</IconButton>
	);
};

const useStyles = makeStyles((theme) => ({
	recorderContainer: {
		display: "flex",
        justifyContent: 'space-between',
        alignItems: 'center',
		width: "200px",
		background: "#222",
        padding: '10px',
        color: 'rgba(255,255,255,0.7)',
        [theme.breakpoints.down('sm')]: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'calc(100% - 20px)',
            padding: '10px',
            
        }
	},
    text: {
        fontSize: '16px',
        textAlign: 'center',
        [theme.breakpoints.down('sm')]: {
            fontSize: '22px'
        }
        
    },
    recordCounter: {
        position: 'relative',
    },
	icon: {
		fontSize: "20px",
		color: "white",
	},
    btn: {
        color: "white",
		padding: "5px",
		margin: " 0 5px 1px",
		border: "1px solid rgba(255,255,255,0.5)"
    },
    submitRecording: {
        background: '#27bf1f'
    },
    stopdButton: {
        background: '#bf3636'
    },
    blinkingMic: {
        position: 'absolute',
        margin: 'auto',
        top: '-15px',
        left: '-1px',
        fontSize: '48px',
        color: 'rgba(252, 3, 3, 0.2)',
        animation: '$blink 2s ease-in infinite',
        [theme.breakpoints.down('sm')]: {
            fontSize: '64px'
        }
    },
    '@keyframes blink': {
        '0%': {
          opacity: 0,
        },
        '50%': {
            opacity: 1,
          },
        '100%': {
          opacity: 0,
        },
      },
}));
