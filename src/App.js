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
	Grid,
	Segment,
	Icon,
	Dimmer,
	Loader,
	Divider
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
		groupedByArtist[artist] = groupBy(
			groupedByArtist[artist].sort((x, y) =>
				x.album.name.localeCompare(y.album.name)
			),
			value => value.album.name
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

				setUserTracks(massageTracks(tracks.map(track => track.track)));
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
				<Dimmer active>
					<Loader>Loading Tracks...</Loader>
				</Dimmer>
			)}
			<Segment basic>
				{isAuthorized && (
					<Stage>
						{Object.keys(userTracks).length > 0 && (
							<div>
								<h2>Total Artists: {Object.keys(userTracks).length}</h2>

								{Object.keys(userTracks).map(artist => (
									<div key={artist}>
										<h3>{artist}</h3>
										<Grid centered doubling>
											{Object.keys(userTracks[artist]).map(album => (
												<>
													<Grid.Row key={album}>
														<Grid.Column width={6}>
															<img
																src={
																	userTracks[artist][album][0].album.images[1]
																		.url
																}
																alt={`${album} album artwork`}
															/>
															<h4>{album}</h4>
															<p>
																{
																	userTracks[artist][album][0].album
																		.release_date
																}
															</p>
														</Grid.Column>

														<Grid.Column width={10}>
															{userTracks[artist][album]
																.sort((a, b) => a.track_number - b.track_number)
																.map(track => (
																	<p key={track.id}>
																		<Icon
																			name="play"
																			onClick={async () => {
																				await setPlayingTrack(track);

																				const result = await getCurrentlyPlaying();
																				setCurrentlyPlaying(result);
																			}}
																			style={{
																				cursor: 'pointer'
																			}}
																		/>{' '}
																		{track.track_number}) {track.name}
																	</p>
																))}
														</Grid.Column>
													</Grid.Row>
													<Divider />
												</>
											))}
										</Grid>
									</div>
								))}
							</div>
						)}
					</Stage>
				)}
			</Segment>
		</>
	);
}

export default App;
