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
import Stage from './Stage';
import {
	Segment,
	Button,
	Icon,
	Table,
	Dimmer,
	Loader
} from 'semantic-ui-react';
import localforage from 'localforage';

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

	const [isLoading, setLoading] = useState(false);

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
			setLoading(true);

			const numberOfKeys = await localforage.length();

			if (numberOfKeys > 0) {
				let localTracks = [];

				await localforage.iterate((value, key, iterationNumber) => {
					localTracks = localTracks.concat(value);
				});

				localTracks = localTracks.sort((x, y) =>
					x.artists[0].name.localeCompare(y.artists[0].name)
				);

				setUserTracks(localTracks);
			} else {
				const tracks = await getUserTracks();

				tracks.forEach(async track => {
					await localforage.setItem(track.track.id, track.track);
				});

				setUserTracks(
					tracks
						.map(track => track.track)
						.sort((x, y) => x.artists[0].name.localeCompare(y.artists[0].name))
				);
			}
			setLoading(false);
		}

		if (isAuthorized) fetchUserTracks();
	}, [isAuthorized]);

	return (
		<>
			<MainMenuBar
				isAuthorized={isAuthorized}
				userData={userData}
				currentlyPlaying={currentlyPlaying}
				onLogin={login}
				onLogout={() => logout(setIsAuthorized)}
			></MainMenuBar>
			{isLoading && (
				<Dimmer active inverted>
					<Loader inverted>Loading Tracks...</Loader>
				</Dimmer>
			)}
			<Segment basic>
				{isAuthorized && (
					<Stage>
						{userTracks.length > 0 && (
							<div>
								<h2>Total Tracks: {userTracks.length}</h2>
								<Table celled>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell></Table.HeaderCell>
											<Table.HeaderCell>Artists</Table.HeaderCell>
											<Table.HeaderCell>Track Name</Table.HeaderCell>
											<Table.HeaderCell>Album</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{userTracks.map(track => (
											<Table.Row key={track.id}>
												<Table.Cell>
													<Button
														primary
														onClick={async () => {
															await setPlayingTrack(track);

															const result = await getCurrentlyPlaying();
															setCurrentlyPlaying(result);
														}}
													>
														<Icon name="play" /> Play
													</Button>
												</Table.Cell>
												<Table.Cell>
													{track.artists.map(artist => artist.name).join(', ')}
												</Table.Cell>
												<Table.Cell>{track.name}</Table.Cell>
												<Table.Cell>{track.album.name}</Table.Cell>
											</Table.Row>
										))}
									</Table.Body>
								</Table>
							</div>
						)}
					</Stage>
				)}
			</Segment>
		</>
	);
}

export default App;
