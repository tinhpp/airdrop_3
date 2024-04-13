/* eslint-disable react/prop-types */
import { useRef } from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import { useOnClickOutside } from 'usehooks-ts';
import styles from '../../styles.module.scss';

export default function SocialShare({ onClose }) {
  const ref = useRef(null);
  useOnClickOutside(ref, () => onClose());

  return (
    <div className={styles['social-share']}>
      <div ref={ref}>
        <div className={styles['social-title']}>Where you do want to share?</div>
        <div className={styles['social-list']}>
          <FacebookShareButton url={window.location.href} title="AvengersFi">
            <FacebookIcon size={64} round={true} />
          </FacebookShareButton>
          <LinkedinShareButton url={window.location.href} title="AvengersFi">
            <LinkedinIcon size={64} round={true} />
          </LinkedinShareButton>
          <TelegramShareButton url={window.location.href} title="AvengersFi">
            <TelegramIcon size={64} round={true} />
          </TelegramShareButton>
          <TwitterShareButton url={window.location.href} title="AvengersFi">
            <TwitterIcon size={64} round={true} />
          </TwitterShareButton>
        </div>
      </div>
    </div>
  );
}
