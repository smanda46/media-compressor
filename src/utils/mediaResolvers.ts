import { Platform } from 'react-native';
import { Asset } from 'react-native-image-picker';
import DocumentPicker, { types as DocTypes } from 'react-native-document-picker';
import { createVideoThumbnail, getRealPath } from 'react-native-compressor';
import type { Picked, MediaKind } from '../types/media';

export async function resolveFromImagePicker(a: Asset): Promise<Picked> {
  if (!a.uri) throw new Error('No asset URI');
  const isImage = (a.type ?? '').startsWith('image');
  const kind: MediaKind = isImage ? 'image' : 'video';
  let fileUri = a.uri;

  if (Platform.OS === 'ios' && fileUri.startsWith('ph://')) {
    fileUri = await getRealPath(fileUri, isImage ? 'image' : 'video');
  }

  let displayUri = fileUri;
  if (kind === 'video') {
    try {
      const thumb = await createVideoThumbnail(fileUri);
      displayUri = thumb.path;
    } catch {}
  }

  return {
    kind,
    name: a.fileName || (isImage ? 'photo.jpg' : 'video.mp4'),
    mime: a.type || (isImage ? 'image/jpeg' : 'video/mp4'),
    inputUri: fileUri,
    displayUri,
  };
}

export async function resolveFromDocumentPicker(): Promise<Picked> {
  const res = await DocumentPicker.pickSingle({
    type: [DocTypes.images, DocTypes.video],
    copyTo: 'cachesDirectory',
    presentationStyle: 'fullScreen',
  });

  const uri = (res.fileCopyUri || res.uri)!;
  const isImage =
    (res.type ?? '').startsWith('image') ||
    /\.(heic|jpg|jpeg|png|webp)$/i.test(res.name || '');
  const kind: MediaKind = isImage ? 'image' : 'video';

  let displayUri = uri;
  if (kind === 'video') {
    try {
      const thumb = await createVideoThumbnail(uri);
      displayUri = thumb.path;
    } catch {}
  }

  return {
    kind,
    name: res.name || (isImage ? 'photo.jpg' : 'video.mp4'),
    mime: res.type || (isImage ? 'image/jpeg' : 'video/mp4'),
    inputUri: uri,
    displayUri,
  };
}