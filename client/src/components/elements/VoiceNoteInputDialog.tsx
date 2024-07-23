'use client';

import React from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';
import Centered from '../containers/centered';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';

type VoiceInputInputProps = {
	children: React.ReactNode;
	onConfirm: (data: Blob) => void;
};

const VoiceNoteInputDialog = ({ children, onConfirm }: VoiceInputInputProps) => {
	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const [data, setData] = React.useState<Blob | null>(null);

	const handleClose = () => {
		buttonRef.current?.click();
	};

	const handleConfirm = () => {
		if (!data) return;
		onConfirm(data);
		handleClose();
	};

	const addAudioElement = (blob: any) => {
		setData(blob);
	};

	return (
		<Dialog>
			<DialogTrigger asChild ref={buttonRef}>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upload a Voice Note</DialogTitle>
					<DialogDescription>Click button to start recording</DialogDescription>
				</DialogHeader>
				<div className='my-6'>
					<Centered>
						<AudioRecorder
							onRecordingComplete={addAudioElement}
							audioTrackConstraints={{
								noiseSuppression: true,
								echoCancellation: true,
							}}
							downloadFileExtension='webm'
							showVisualizer
						/>
					</Centered>
				</div>
				<DialogFooter>
					<Button variant={'outline'} onClick={handleClose}>
						Cancel
					</Button>
					<Button onClick={handleConfirm} disabled={!data}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default VoiceNoteInputDialog;