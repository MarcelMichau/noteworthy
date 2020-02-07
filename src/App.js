import React, { useState, useEffect } from 'react';
import {
	login,
	logout,
	getUserDetail,
	getUserTracks,
	getCurrentlyPlaying,
	setPlayingTrack
} from './spotifyApi';
import MainMenuBar from './MainMenuBar';
import { Button, Icon } from 'semantic-ui-react';

const authCallback = () => {
	let hash = window.location.hash.substr(1);

	let result = hash.split('&').reduce(function(result, item) {
		let parts = item.split('=');
		result[parts[0]] = parts[1];
		return result;
	}, {});

	console.log(result);

	localStorage.setItem('access_token', result['access_token']);

	if (window.location.hostname === 'marcelmichau.github.io') {
		window.location.href = `${window.location.origin}/noteworthy`;
	} else {
		window.location.href = window.location.origin;
	}

	return result;
};

function App() {
	const hasBeenAuthorized = localStorage.getItem('access_token') !== null;

	const [isAuthorized, setIsAuthorized] = useState(hasBeenAuthorized);

	const [userData, setUserData] = useState({});

	const [userTracks, setUserTracks] = useState({ items: 0 });

	const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

	useEffect(() => {
		if (window.location.hash) {
			setIsAuthorized(authCallback());
		}
	}, []);

	useEffect(() => {
		async function fetchCurrentlyPlaying() {
			const result = await getCurrentlyPlaying();
			setCurrentlyPlaying(result);
		}

		if (isAuthorized) fetchCurrentlyPlaying();
	}, [isAuthorized]);

	useEffect(() => {
		async function fetchUserDetail() {
			const result = await getUserDetail();
			setUserData(result);
		}

		if (isAuthorized) fetchUserDetail();
	}, [isAuthorized]);

	useEffect(() => {
		async function fetchUserTracks() {
			const result = await getUserTracks();
			setUserTracks(result);
		}

		if (isAuthorized) fetchUserTracks();
	}, [isAuthorized]);

	return (
		<div>
			<MainMenuBar
				isAuthorized={isAuthorized}
				userData={userData}
				currentlyPlaying={currentlyPlaying}
				onLogin={login}
				onLogout={() => logout(setIsAuthorized)}
			></MainMenuBar>
			{isAuthorized && (
				<div>
					{userTracks.items.length > 0 && (
						<div>
							<h2>Recent Tracks</h2>
							{userTracks.items.map(item => (
								<div key={item.track.id}>
									<p>
										<Button
											onClick={async () => {
												await setPlayingTrack(item.track);

												const result = await getCurrentlyPlaying();
												setCurrentlyPlaying(result);
											}}
										>
											<Icon name="play" />
										</Button>
										{item.track.artists[0].name} - {item.track.name}:{' '}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default App;
