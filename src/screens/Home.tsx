import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert, Image, Linking, SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, View,
} from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { launchImageLibrary } from 'react-native-image-picker';
import Upload from 'react-native-background-upload';
import { Image as ImgCompressor, Video as VidCompressor } from 'react-native-compressor';

import { COMPRESS_IMG, COMPRESS_VID, LOGO_BASE64, UPLOAD_URL } from '../constants';
import { formatBytes } from '../utils/format';
import { statSize } from '../utils/fs';
import { resolveFromDocumentPicker, resolveFromImagePicker } from '../utils/mediaResolvers';
import type { Picked } from '../types/media';

import Btn from '../components/Btn';
import Pill from '../components/Pill';
import ProgressBar from '../components/ProgressBar';
import SectionTitle from '../components/SectionTitle';

export default function Home() {
  const [picked, setPicked] = useState<Picked | null>(null);
  const [origSize, setOrigSize] = useState<number | undefined>();
  const [compUri, setCompUri] = useState<string | null>(null);
  const [compSize, setCompSize] = useState<number | undefined>();

  const [compressPct, setCompressPct] = useState(0);
  const [uploadPct, setUploadPct] = useState(0);

  const [compressing, setCompressing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const cancelCompressionId = useRef<string>('');
  const currentUploadId = useRef<string>('');

  const reset = useCallback(() => {
    setPicked(null);
    setOrigSize(undefined);
    setCompUri(null);
    setCompSize(undefined);
    setCompressPct(0);
    setUploadPct(0);
    setCompressing(false);
    setUploading(false);
    cancelCompressionId.current = '';
    currentUploadId.current = '';
  }, []);

  const pickFromPhotos = useCallback(async () => {
    try {
      reset();
      const res = await launchImageLibrary({
        mediaType: 'mixed',
        selectionLimit: 1,
        includeExtra: true,
        presentationStyle: 'fullScreen',
      });
      if (!res.assets?.length) return;
      const p = await resolveFromImagePicker(res.assets[0]);
      setPicked(p);
      setOrigSize(await statSize(p.inputUri));
    } catch (e: any) {
      if (e?.message?.includes('permission')) {
        Alert.alert('Permission required', 'Please allow Photos access in Settings.');
      } else if (e?.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Pick failed', String(e?.message || e));
      }
    }
  }, [reset]);

  const pickFromFiles = useCallback(async () => {
    try {
      reset();
      const p = await resolveFromDocumentPicker();
      setPicked(p);
      setOrigSize(await statSize(p.inputUri));
    } catch (e: any) {
    }
  }, [reset]);

  const compress = useCallback(async () => {
    if (!picked) return;
    setCompressing(true);
    setCompressPct(0);
    try {
      let outUri: string;
      if (picked.kind === 'image') {
        outUri = await ImgCompressor.compress(picked.inputUri, COMPRESS_IMG);
      } else {
        outUri = await VidCompressor.compress(
          picked.inputUri,
          {
            ...COMPRESS_VID,
            getCancellationId: (id: string) => (cancelCompressionId.current = id),
            progressDivider: 5,
          },
          (progress: number) => setCompressPct(Math.round(progress * 100)),
        );
      }
      setCompUri(outUri);
      setCompSize(await statSize(outUri));
    } catch (e: any) {
      Alert.alert('Compression failed', String(e?.message || e));
    } finally {
      setCompressing(false);
    }
  }, [picked]);

  const cancelCompression = useCallback(() => {
    if (cancelCompressionId.current) {
      VidCompressor.cancelCompression(cancelCompressionId.current);
    }
  }, []);

  const saveToPhotos = useCallback(async () => {
    if (!compUri || !picked) return;
    try {
      const mediaType: 'photo' | 'video' = picked.kind === 'image' ? 'photo' : 'video';
      const anyCR = CameraRoll as any;
      let savedId: string;
      if (typeof anyCR.saveAsset === 'function') {
        savedId = await anyCR.saveAsset(compUri, { type: mediaType, album: 'MediaZip' });
      } else {
        savedId = await CameraRoll.save(compUri, { type: mediaType, album: 'MediaZip' } as any);
      }
      Alert.alert('Saved', `Saved to Photos.\nAsset ID:\n${savedId}`);
    } catch (e: any) {
      Alert.alert('Save failed', String(e?.message || e));
    }
  }, [compUri, picked]);

  const upload = useCallback(async () => {
    if (!compUri) return;
    setUploading(true);
    setUploadPct(0);
    try {
      const opts = {
        url: UPLOAD_URL!,
        path: compUri,
        method: 'POST' as const,
        type: 'multipart' as const,
        field: 'file',
        headers: { Accept: 'application/json' },
      };
      const uploadId = await Upload.startUpload(opts);
      currentUploadId.current = uploadId;

      const subP = Upload.addListener('progress', uploadId, d => {
        setUploadPct(Math.round(d.progress));
      });
      const subE = Upload.addListener('error', uploadId, d => {
        Alert.alert('Upload error', d.error || 'Unknown error');
        setUploading(false);
      });
      const subC = Upload.addListener('cancelled', uploadId, () => {
        setUploading(false);
      });
      const subDone = Upload.addListener('completed', uploadId, d => {
        setUploading(false);
        Alert.alert('Upload complete', `Server responded ${d.responseCode}`);
        subP.remove(); subE.remove(); subC.remove(); subDone.remove();
      });
    } catch (e: any) {
      Alert.alert('Upload failed', String(e?.message || e));
      setUploading(false);
    }
  }, [compUri]);

  const cancelUpload = useCallback(async () => {
    if (currentUploadId.current) {
      try { await Upload.cancelUpload(currentUploadId.current); } catch {}
      setUploading(false);
    }
  }, []);

  const ratio = useMemo(() => {
    if (!origSize || !compSize) return '—';
    return `${((compSize / origSize) * 100).toFixed(0)}%`;
  }, [origSize, compSize]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.wrap} bounces>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logoWrap}>
              <Image source={{ uri: `data:image/png;base64,${LOGO_BASE64}` }} style={styles.logo} />
            </View>
            <View>
              <Text style={styles.brandName}>MediaZip</Text>
              <Text style={styles.brandTag}>Compress • Save • Upload</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <Btn label="Docs" kind="ghost" small onPress={() => Linking.openURL('https://github.com/numandev1/react-native-compressor')} />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.cardRow}>
          <View style={styles.cardAction}>
            <Text style={styles.cardTitle}>Pick from Photos</Text>
            <Text style={styles.cardHint}>Choose from Camera Roll (handles iCloud)</Text>
            <Btn label="Open Photos" onPress={pickFromPhotos} />
          </View>
          <View style={styles.cardAction}>
            <Text style={styles.cardTitle}>Pick from Files</Text>
            <Text style={styles.cardHint}>Browse iCloud/Drive/Downloads</Text>
            <Btn label="Open Files" kind="neutral" onPress={pickFromFiles} />
          </View>
        </View>

        {/* Selected media */}
        {picked && (
          <View style={styles.mediaCard}>
            <View style={styles.mediaHeader}>
              <Text style={styles.mediaName} numberOfLines={1}>{picked.name}</Text>
              <View style={styles.pills}>
                <Pill label={picked.kind.toUpperCase()} />
                <Pill label={`Original ${formatBytes(origSize)}`} />
              </View>
            </View>

            <Image source={{ uri: picked.displayUri }} style={styles.preview} resizeMode="cover" />

            {!compUri ? (
              <View style={styles.bar}>
                <Btn label={compressing ? `Compressing…` : 'Compress'} onPress={compress} disabled={compressing} />
                {compressing && <Btn label="Cancel" kind="ghost" onPress={cancelCompression} />}
              </View>
            ) : (
              <View style={styles.statRow}>
                <Pill label={`Compressed ${formatBytes(compSize)}`} />
                <Pill label={`Ratio ${ratio}`} />
              </View>
            )}

            {compressing && (
              <>
                <SectionTitle>Compression</SectionTitle>
                <ProgressBar pct={compressPct} />
              </>
            )}

            {compUri && (
              <>
                <SectionTitle>Next Steps</SectionTitle>
                <View style={styles.bar}>
                  <Btn label={uploading ? `Uploading…` : 'Upload'} onPress={upload} disabled={uploading} />
                  {uploading
                    ? <Btn label="Cancel Upload" kind="ghost" onPress={cancelUpload} />
                    : <Btn label="Save to Photos" kind="neutral" onPress={saveToPhotos} />}
                </View>
                {uploading && <ProgressBar pct={uploadPct} />}
              </>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Helpful Links</Text>
          <View style={styles.linksRow}>
            <Btn label="Image Picker" kind="ghost" onPress={() => Linking.openURL('https://github.com/react-native-image-picker/react-native-image-picker')} />
            <Btn label="Document Picker" kind="ghost" onPress={() => Linking.openURL('https://github.com/bemyeyes/react-native-document-picker')} />
            <Btn label="Background Upload" kind="ghost" onPress={() => Linking.openURL('https://github.com/Vydia/react-native-background-upload')} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0B0F' },
  wrap: { padding: 16, gap: 16 },

  header: {
    backgroundColor: '#0F1117',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1C2030',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  brand: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  logoWrap: {
    width: 44, height: 44, borderRadius: 12, overflow: 'hidden',
    backgroundColor: '#1B2030', borderWidth: 1, borderColor: '#2A3147',
  },
  logo: { width: '100%', height: '100%' },
  brandName: { color: '#E8ECF3', fontSize: 22, fontWeight: '800', letterSpacing: 0.3 },
  brandTag: { color: '#9AA4B2', fontSize: 12 },
  headerActions: { flexDirection: 'row', gap: 8 },

  cardRow: { flexDirection: 'row', gap: 12 },
  cardAction: {
    flex: 1, backgroundColor: '#0F1117', borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: '#1C2030', gap: 10,
  },
  cardTitle: { color: '#E8ECF3', fontSize: 16, fontWeight: '700' },
  cardHint: { color: '#9AA4B2', fontSize: 13 },

  mediaCard: {
    backgroundColor: '#0F1117', borderRadius: 24, padding: 16,
    borderWidth: 1, borderColor: '#1C2030', gap: 12,
  },
  mediaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  mediaName: { flex: 1, color: '#E8ECF3', fontWeight: '700', fontSize: 15 },
  pills: { flexDirection: 'row', gap: 8 },
  preview: {
    width: '100%', height: 240, borderRadius: 16,
    backgroundColor: '#0B0E14', borderWidth: 1, borderColor: '#1C2030',
  },

  section: { color: '#B6C1D6', fontWeight: '700', marginTop: 4, marginBottom: -6, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2 },

  bar: { flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  statRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },

  footerCard: {
    backgroundColor: '#0F1117', borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: '#1C2030', gap: 12, marginBottom: 12,
  },
  footerTitle: { color: '#E8ECF3', fontWeight: '700', fontSize: 14 },
  linksRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
});
