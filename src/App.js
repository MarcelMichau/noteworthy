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
	Icon,
	Dimmer,
	Loader,
	Item,
	Divider,
	Statistic
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

function convertDuration(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return seconds === 60
		? minutes + 1 + ':00'
		: minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function App() {
	const hasBeenAuthorized = localStorage.getItem('access_token') !== null;

	const [isAuthorized, setIsAuthorized] = useState(hasBeenAuthorized);

	const [userData, setUserData] = useState({});

	const [userTracks, setUserTracks] = useState({});

	const [trackCount, setTrackCount] = useState(0);

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

				setTrackCount(localTracks.length);
				setUserTracks(massageTracks(localTracks));
			} else {
				const tracks = await getUserTracks();

				tracks.forEach(async track => {
					await localforage.setItem(track.track.id, track.track);
				});

				setTrackCount(tracks.length);
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
								<Statistic.Group widths="two">
									<Statistic>
										<Statistic.Value>
											{Object.keys(userTracks).length}
										</Statistic.Value>
										<Statistic.Label>Artists</Statistic.Label>
									</Statistic>
									<Statistic>
										<Statistic.Value>{trackCount}</Statistic.Value>
										<Statistic.Label>Tracks</Statistic.Label>
									</Statistic>
								</Statistic.Group>

								<Divider></Divider>

								{Object.keys(userTracks).map(artist => (
									<div key={artist}>
										<h3>{artist}</h3>
										<Item.Group divided>
											{Object.keys(userTracks[artist]).map(album => (
												<Item key={album}>
													<div className="image">
														<img
															loading="lazy"
															width="300"
															height="300"
															src={
																userTracks[artist][album][0].album.images[1].url
															}
															alt={album}
														/>
													</div>

													<Item.Content>
														<Item.Header as="a">{album}</Item.Header>
														<Item.Meta>
															{userTracks[artist][album][0].album.release_date}
														</Item.Meta>
														<Item.Description>
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
																		{track.track_number}) {track.name} -{' '}
																		{convertDuration(track.duration_ms)}
																	</p>
																))}
														</Item.Description>
													</Item.Content>
												</Item>
											))}
										</Item.Group>
										<Divider></Divider>
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
