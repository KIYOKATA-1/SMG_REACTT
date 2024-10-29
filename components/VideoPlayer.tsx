import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

interface VideoPlayerProps {
  videoData: {
    video_480?: string;
    video_720?: string;
    video_1080?: string;
  };
  videoName: string;
  description: string;
  onComplete: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoData, onComplete }) => {
  const videoRef = useRef<Video>(null); 
  const [quality, setQuality] = useState<'480' | '720' | '1080'>('1080');
  const [isLoading, setIsLoading] = useState(true);

  const videoUrls = {
    '480': videoData.video_480,
    '720': videoData.video_720,
    '1080': videoData.video_1080,
  };

  useEffect(() => {
    if (videoUrls[quality]) {
      setIsLoading(true);
    }
  }, [quality]);

  const handleLoad = (status: any) => {
    if (status.isLoaded) {
      setIsLoading(false);
    }
  };

  const handleError = (error: any) => {
    console.error('Ошибка загрузки видео:', error);
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {videoUrls[quality] ? (
          <Video
            ref={videoRef}
            source={{ uri: videoUrls[quality] }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN} 
            onPlaybackStatusUpdate={handleLoad}
            onError={handleError}
          />
        ) : (
          <Text style={styles.errorText}>Видео в выбранном качестве недоступно</Text>
        )}
        {isLoading && <ActivityIndicator size="large" color="#fff" style={styles.loader} />}
      </View>

      <View style={styles.qualitySelector}>
        {Object.keys(videoUrls).map((q) => (
          <TouchableOpacity
            key={q}
            onPress={() => setQuality(q as '480' | '720' | '1080')}
            style={[styles.qualityButton, quality === q && styles.selectedQuality]}
          >
            <Text style={styles.qualityText}>{q}p</Text>
          </TouchableOpacity>
        ))}
      </View>


      <TouchableOpacity onPress={onComplete} style={styles.completeButton}>
        <Text style={styles.completeButtonText}>Завершить просмотр</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  videoContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
  },
  qualitySelector: {
    flexDirection: 'row',
    marginTop: 10,
  },
  qualityButton: {
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  selectedQuality: {
    backgroundColor: '#5F2DED',
  },
  qualityText: {
    color: '#fff',
  },
  completeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#5F2DED',
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default VideoPlayer;
