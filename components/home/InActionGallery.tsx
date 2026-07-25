import { PhotoCarousel } from '@/components/PhotoCarousel';
import { galleryPhotos } from '@/data/gallery';

export function InActionGallery() {
  return <PhotoCarousel photos={galleryPhotos} label="Professor Gupta in action" />;
}
