import AudioPlayer from './AudioPlayer';
import { Gif } from './Gif';
import OSBPlayer from './Player';
import VideoPlayer from './VideoPlayer';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { StyledImage } from './styled';

const Player = OSBPlayer;

Player.Image = StyledImage;
Player.LazyImage = LazyLoadImage;
Player.GIF = Gif;
Player.Video = VideoPlayer;
Player.Audio = AudioPlayer;

export default Player;
