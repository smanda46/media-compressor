import * as RNFS from '@dr.pogodin/react-native-fs';

export async function statSize(fileUri: string) {
  if (!fileUri) return 0;

  if (!RNFS || typeof RNFS.stat !== 'function') {
    throw new Error('RNFS not initialized (check pods / rebuild)');
  }

  const asPath = fileUri.startsWith('file://')
    ? decodeURI(fileUri.replace('file://', ''))
    : decodeURI(fileUri);

  try {
    const st = await RNFS.stat(asPath);
    return Number(st.size ?? 0);
  } catch {
    try {
      const st2 = await RNFS.stat(fileUri);
      return Number(st2.size ?? 0);
    } catch (e) {
      console.warn('stat failed for', fileUri, e);
      return 0;
    }
  }
}