import React, { useState, useEffect } from 'react';
import {
	login,
	logout,
	getUserDetail,
	getUserTracks,
	getCurrentlyPlaying,
	setPlayingTrack,
} from './spotifyApi';
import MainMenuBar from './MainMenuBar';
import Stage from './Stage';
import {
	Segment,
	Input,
	Grid,
	Icon,
	Dimmer,
	Loader,
	Item,
	Menu,
	Image,
	Divider,
	Statistic,
	Header,
	Label,
} from 'semantic-ui-react';
import localforage from 'localforage';
import { groupBy } from 'lodash';

const authCallback = () => {
	let hash = window.location.hash.substr(1);

	let result = hash.split('&').reduce(function (result, item) {
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

const massageTracks = (tracks) => {
	const sortedTracks = tracks.sort((x, y) =>
		x.artists[0].name.localeCompare(y.artists[0].name)
	);

	const groupedByArtist = groupBy(
		sortedTracks,
		(value) => value.artists[0].name
	);

	Object.keys(groupedByArtist).forEach((artist) => {
		groupedByArtist[artist] = groupBy(
			groupedByArtist[artist].sort((x, y) =>
				x.album.name.localeCompare(y.album.name)
			),
			(value) => value.album.name
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

	const [selectedArtist, setSelectedArtist] = useState('');

	const [filteredArtist, setFilteredArtist] = useState('');

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

				tracks.forEach(async (track) => {
					await localforage.setItem(track.track.id, track.track);
				});

				setTrackCount(tracks.length);
				setUserTracks(massageTracks(tracks.map((track) => track.track)));
			}
			setLoading(false);
		}

		if (isAuthorized) fetchUserTracks();
	}, [isAuthorized]);

	const onArtistClick = (e, { name }) => setSelectedArtist(name);

	const onArtistFilter = (e) => {
		setFilteredArtist(e.target.value);
	};

	return (
		<>
			<MainMenuBar
				isAuthorized={isAuthorized}
				currentlyPlaying={currentlyPlaying}
				onLogin={login}
				onLogout={() => logout(setIsAuthorized)}
			></MainMenuBar>
			{isLoading && (
				<Dimmer active>
					<Loader>Loading Tracks...</Loader>
				</Dimmer>
			)}

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					position: 'fixed',
					top: 48,
					bottom: 0,
					left: 0,
					width: '250px',
				}}
			>
				<div
					style={{
						flex: '0 0 auto',
					}}
				>
					<Menu vertical inverted borderless>
						<Menu.Item>
							<Input
								className="icon"
								icon="search"
								placeholder="Filter Artists..."
								value={filteredArtist}
								onChange={onArtistFilter}
							/>
						</Menu.Item>
					</Menu>
				</div>
				<div
					style={{
						flex: 1,
						overflowY: 'scroll',
					}}
				>
					<Menu vertical inverted borderless>
						{filteredArtist !== ''
							? Object.keys(userTracks)
									.filter((artist) =>
										artist.toLowerCase().includes(filteredArtist.toLowerCase())
									)
									.map((artist) => (
										<Menu.Item
											key={artist}
											name={artist}
											active={selectedArtist === artist}
											onClick={onArtistClick}
										>
											{artist}
										</Menu.Item>
									))
							: Object.keys(userTracks).map((artist) => (
									<Menu.Item
										key={artist}
										name={artist}
										active={selectedArtist === artist}
										onClick={onArtistClick}
									>
										{artist}
									</Menu.Item>
							  ))}
					</Menu>
				</div>
				<div
					style={{
						flex: '0 0 auto',
					}}
				>
					<Menu vertical inverted borderless>
						{userData.id && (
							<Menu.Item>
								<Image src={userData.images[0].url} avatar />
								<span>{userData.display_name}</span>
							</Menu.Item>
						)}
					</Menu>
				</div>
			</div>

			<div style={{ marginLeft: '250px' }}>
				<Segment basic>
					{isAuthorized && (
						<Stage>
							{Object.keys(userTracks).length > 0 && (
								<div>
									{selectedArtist !== '' ? (
										<div>
											<h1>{selectedArtist}</h1>
											<Divider></Divider>
											<div key={selectedArtist}>
												<Item.Group divided>
													{Object.keys(userTracks[selectedArtist]).map(
														(album) => (
															<Item key={album}>
																<div className="image">
																	<img
																		loading="lazy"
																		width="300"
																		height="300"
																		src={
																			userTracks[selectedArtist][album][0].album
																				.images[1].url
																		}
																		alt={album}
																	/>
																</div>

																<Item.Content>
																	<Item.Header as="a">{album}</Item.Header>
																	<Item.Meta>
																		{
																			userTracks[selectedArtist][album][0].album
																				.release_date
																		}
																	</Item.Meta>
																	<Item.Description>
																		{userTracks[selectedArtist][album]
																			.sort(
																				(a, b) =>
																					a.track_number - b.track_number
																			)
																			.map((track) => (
																				<div
																					key={track.id}
																					style={{ paddingBottom: '5px' }}
																				>
																					<Icon
																						name="play"
																						onClick={async () => {
																							await setPlayingTrack(track);

																							const result = await getCurrentlyPlaying();
																							setCurrentlyPlaying(result);
																						}}
																						style={{
																							cursor: 'pointer',
																						}}
																						color={
																							track.id ===
																							currentlyPlaying.item.id
																								? 'green'
																								: 'grey'
																						}
																					/>{' '}
																					{track.track_number}) {track.name} -{' '}
																					{convertDuration(track.duration_ms)}{' '}
																					{track.explicit && (
																						<Label color="red">Explicit</Label>
																					)}
																				</div>
																			))}
																	</Item.Description>
																</Item.Content>
															</Item>
														)
													)}
												</Item.Group>
											</div>
										</div>
									) : (
										<Grid textAlign="center">
											<Grid.Row>
												<Grid.Column>
													<Header as="h1" color="green">
														noteworthy for Spotify
													</Header>

													<Divider></Divider>

													<h2>Library Stats</h2>

													<Statistic.Group widths="two">
														<Statistic color="green">
															<Statistic.Value>
																{Object.keys(userTracks).length}
															</Statistic.Value>
															<Statistic.Label>Artists</Statistic.Label>
														</Statistic>
														<Statistic color="green">
															<Statistic.Value>{trackCount}</Statistic.Value>
															<Statistic.Label>Tracks</Statistic.Label>
														</Statistic>
													</Statistic.Group>

													<Divider></Divider>

													<p>
														Click on an Artist in the Sidebar to view their
														Albums
													</p>
												</Grid.Column>
											</Grid.Row>
										</Grid>
									)}
								</div>
							)}
						</Stage>
					)}
				</Segment>
			</div>
		</>
	);
}

export default App;
