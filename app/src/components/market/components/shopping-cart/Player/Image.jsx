import { Gif } from './Gif';
import { ImageWrapper, StyledImage } from './styled';

export const Image = ({ src, isGif = false, ...props }) => {
  return (
    <ImageWrapper className="player">
      {isGif ? <Gif src={src} style={props.style} /> : <StyledImage preview={false} src={src} {...props} />}
    </ImageWrapper>
  );
};

export default Image;
