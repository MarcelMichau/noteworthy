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
import { groupBy } from 'lodash';

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

const massageTracks = tracks => {
	const sortedTracks = tracks.sort((x, y) =>
		x.artists[0].name.localeCompare(y.artists[0].name)
	);

	const groupedByArtist = groupBy(sortedTracks, value => value.artists[0].name);

	Object.keys(groupedByArtist).forEach(artist => {
		groupedByArtist[artist] = groupedByArtist[artist].sort((x, y) =>
			x.album.name.localeCompare(y.album.name)
		);
	});

	return groupedByArtist;
};

function App() {
	const hasBeenAuthorized = localStorage.getItem('access_token') !== null;

	const [isAuthorized, setIsAuthorized] = useState(hasBeenAuthorized);

	const [userData, setUserData] = useState({});

	const [userTracks, setUserTracks] = useState({});

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

				setUserTracks(massageTracks(localTracks));
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
						{Object.keys(userTracks).length > 0 && (
							<div>
								<h2>Total Artists: {Object.keys(userTracks).length}</h2>
								<Table celled>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>Artist</Table.HeaderCell>
											<Table.HeaderCell>Tracks</Table.HeaderCell>
											<Table.HeaderCell>Album</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Object.keys(userTracks).map(artist => (
											<Table.Row key={artist}>
												<Table.Cell>{artist}</Table.Cell>
												<Table.Cell>
													{userTracks[artist].map(track => (
														<div key={track.id}>
															{track.track_number}) {track.name}
														</div>
													))}
												</Table.Cell>
												<Table.Cell>
													{userTracks[artist].map(track => (
														<div key={track.id}>{track.album.name}</div>
													))}
												</Table.Cell>
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
