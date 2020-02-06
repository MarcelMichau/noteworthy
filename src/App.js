import React, { useState, useEffect } from 'react';
import './App.css';

const login = () => {
	const url = 'https://accounts.spotify.com/authorize';
	const clientId = '4b5e3eb3d3d643daa7f8bfd21f074eda';

	window.location = `${url}?client_id=${clientId}&response_type=token&redirect_uri=http://localhost:3000&scope=user-library-read user-read-currently-playing user-modify-playback-state`;
};

const logout = setIsAuthorized => {
	localStorage.removeItem('access_token');

	setIsAuthorized(false);
};

const authCallback = () => {
	let hash = window.location.hash.substr(1);

	let result = hash.split('&').reduce(function(result, item) {
		let parts = item.split('=');
		result[parts[0]] = parts[1];
		return result;
	}, {});

	console.log(result);

	localStorage.setItem('access_token', result['access_token']);

	window.location.href = window.location.origin;

	return result;
};

const getUserDetail = async setUserData => {
	console.log('get user detail called');

	const url = 'https://api.spotify.com/v1/me';

	const accessToken = localStorage.getItem('access_token');

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	const data = await response.json();

	console.log(data);

	setUserData(data);

	return data;
};

const getUserTracks = async setUserTracks => {
	console.log('get user artists called');

	const url = 'https://api.spotify.com/v1/me/tracks?limit=50';

	const accessToken = localStorage.getItem('access_token');

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	const data = await response.json();

	console.log(data);

	setUserTracks(data);

	return data;
};

const getCurrentlyPlaying = async () => {
	console.log('get currently playing called');

	const url = 'https://api.spotify.com/v1/me/player/currently-playing';

	const accessToken = localStorage.getItem('access_token');

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (response.status !== 200) return;

	const data = await response.json();

	console.log(data);

	return data;
};

const setPlayingTrack = async track => {
	console.log('set playing track called');

	const url = 'https://api.spotify.com/v1/me/player/play';

	const accessToken = localStorage.getItem('access_token');

	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${accessToken}`
		},
		body: JSON.stringify({
			uris: [track.uri]
		})
	});

	const data = await response.text();

	return data;
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

	return (
		<div className="App">
			<header className="App-header">
				<p>Spotiview</p>
				{isAuthorized ? (
					<div>
						{currentlyPlaying && currentlyPlaying.item && (
							<p>
								Currently Playing: {currentlyPlaying.item.artists[0].name} -{' '}
								{currentlyPlaying.item.name}
							</p>
						)}
						<button onClick={() => getUserDetail(setUserData)}>
							Get User Details
						</button>
						<button onClick={() => getUserTracks(setUserTracks)}>
							Get Recent Tracks
						</button>
						<button onClick={() => logout(setIsAuthorized)}>Logout</button>
					</div>
				) : (
					<button onClick={login}>Login With Spotify</button>
				)}
			</header>
			{isAuthorized && (
				<div>
					<div>
						{userData.id && (
							<div>
								<h2>{userData.display_name}</h2>
								<img src={userData.images[0].url} alt="" />
							</div>
						)}
					</div>
					<div>
						{userTracks.items.length > 0 && (
							<div>
								{userTracks.items.map(item => (
									<div key={item.track.id}>
										<p>
											{item.track.artists[0].name} - {item.track.name}:{' '}
											<button
												onClick={async () => {
													await setPlayingTrack(item.track);

													const result = await getCurrentlyPlaying();
													setCurrentlyPlaying(result);
												}}
											>
												Play
											</button>
										</p>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
