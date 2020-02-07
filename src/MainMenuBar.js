import React from 'react';
import { Icon, Menu, Image, Button } from 'semantic-ui-react';

const MainMenuBar = ({
	isAuthorized,
	userData,
	currentlyPlaying,
	onLogin,
	onLogout
}) => (
	<Menu inverted fixed="top">
		<Menu.Item
			header
			active
			style={{
				backgroundColor: '#1DB954'
			}}
		>
			noteworthy for Spotify
		</Menu.Item>

		<Menu.Menu position="right">
			{isAuthorized && (
				<>
					{currentlyPlaying && currentlyPlaying.item && (
						<Menu.Item>
							<Icon name="play" /> {currentlyPlaying.item.artists[0].name} -{' '}
							{currentlyPlaying.item.name}
						</Menu.Item>
					)}
					{userData.id && (
						<Menu.Item>
							<Image src={userData.images[0].url} size="mini" circular />
							{userData.display_name}
						</Menu.Item>
					)}
				</>
			)}
			{isAuthorized && (
				<Menu.Item>
					<Button onClick={onLogout}>Logout</Button>
				</Menu.Item>
			)}
			{!isAuthorized && (
				<Menu.Item>
					<Button onClick={onLogin}>Login</Button>
				</Menu.Item>
			)}
		</Menu.Menu>
	</Menu>
);

export default MainMenuBar;
