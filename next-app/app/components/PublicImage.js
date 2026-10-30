import Image from 'next/image';
import {canOptimizePublicImage} from '../../lib/public-image.mjs';

// The existing CSS still determines geometry; sizes only controls the download.
export default function PublicImage({src, alt, ...props}) {
  return <Image src={src} alt={alt} unoptimized={!canOptimizePublicImage(src)} {...props} />;
}
