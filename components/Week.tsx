import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, Text, TouchableOpacity, LayoutAnimation, Animated, SafeAreaView, Modal, ScrollView 
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilm, faFilePdf, faCheck, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { ContentData, ICourseWeek, TestData } from '../services/course/course.types';
import { CourseStyle } from '../styles/Course';
import { useSession } from '../lib/useSession';
import { CourseService } from '../services/course/course.service';
import ProgressBar from '../components/ProgressBar';
import VideoPlayer from './VideoPlayer';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type RootStackParamList = {
  TestPage: { testId: number };
};

type NavigationProp = DrawerNavigationProp<RootStackParamList, 'TestPage'>;

interface WeekProps {
  week: ICourseWeek;
  courseId: number;
}

// Helper function to check if content has `is_ended` property
function hasIsEnded(content: any): content is ContentData & { is_ended: boolean } {
  return content && typeof content.is_ended === 'boolean';
}

const Week: React.FC<WeekProps> = ({ week, courseId }) => {
  const { getSession } = useSession();
  const navigation = useNavigation<NavigationProp>();
  const [expanded, setExpanded] = useState(false);
  const [completedLectures, setCompletedLectures] = useState<Set<number>>(new Set());
  const [selectedVideo, setSelectedVideo] = useState<ContentData | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<ContentData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPDFVisible, setIsPDFVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const toggleExpand = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  }, []);

  useEffect(() => {
    const fetchCompletedContent = async () => {
      const session = await getSession();
      if (session) {
        const completedContent = new Set(
          week.lessons_data.flatMap((lesson) =>
            [...lesson.lectures_data, ...lesson.video_lessons_data, ...lesson.test_data]
              .filter((content) => hasIsEnded(content) && content.is_ended)
              .map((content) => content.id)
              .filter((id): id is number => id !== undefined)
          )
        );
        setCompletedLectures(completedContent);
      }
    };
    fetchCompletedContent();
  }, [week, getSession]);

  const markAsCompleted = useCallback(
    async (content: ContentData | TestData) => {
      const session = await getSession();
      if (!session || content.id === undefined) return;

      try {
        await CourseService.endLessonContent(session.key, content.id);
        setCompletedLectures((prev) => {
          const updated = new Set(prev);
          if (content.id !== undefined) updated.add(content.id);
          return updated;
        });
      } catch (error) {
        console.error('Ошибка завершения контента:', error);
      }
    },
    [getSession]
  );

  const startVideoLesson = useCallback(async (video: ContentData) => {
    const session = await getSession();
    if (!session || !video.id) return;
  
    try {
      await CourseService.startLessonContent(session.key, video.id);
    } catch (error) {
      console.error('Ошибка начала видео:', error);
    }
  }, [getSession]);
  
  const endVideoLesson = useCallback(async (video: ContentData) => {
    const session = await getSession();
    if (!session || !video.id) return;
  
    try {
      await CourseService.endLessonContent(session.key, video.id);
      setCompletedLectures((prev) => {
        const updated = new Set(prev);
        updated.add(video.id);
        return updated;
      });
    } catch (error) {
      console.error('Ошибка завершения видео:', error);
    }
  }, [getSession]);
  
  const openVideo = async (video: ContentData) => {
    await startVideoLesson(video);
    setSelectedVideo(video);
    setIsModalVisible(true);
  };
  
  const closeVideo = async () => {
    if (selectedVideo) {
      await endVideoLesson(selectedVideo);
    }
    setSelectedVideo(null);
    setIsModalVisible(false);
  };
  

  const openPDF = (lecture: ContentData) => {
    setSelectedLecture(lecture);
    setIsPDFVisible(true);
  };

  const closePDF = () => {
    setSelectedLecture(null);
    setIsPDFVisible(false);
  };

  const finishPDF = () => {
    if (selectedLecture) {
      markAsCompleted(selectedLecture);
    }
    closePDF();
  };

  const openTest = (test: TestData) => {
    if (test.id !== undefined) {
      navigation.navigate('TestPage', { testId: test.id });
      if (hasIsEnded(test) && test.is_ended) {
        setCompletedLectures((prev) => {
          const updated = new Set(prev);
          updated.add(test.id);
          return updated;
        });
      }
    } else {
      console.error('ID теста отсутствует');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, width: '100%', paddingHorizontal: 20 }}>
      <ScrollView>
        <Animated.View style={[CourseStyle.weekContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity style={CourseStyle.weekHeader} onPress={toggleExpand}>
            <Text style={CourseStyle.weekText}>{week.name}</Text>
            <ProgressBar size={250} progress={week.user_week_completion || 0} textSize={12} />
          </TouchableOpacity>

          {expanded && (
  <View style={CourseStyle.lessonContainer}>
    <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled>
      {week.lessons_data.map((lesson, index) => (
        <React.Fragment key={lesson.id}>
          <View style={CourseStyle.lessonItem}>
            <Text style={CourseStyle.lessonText}>{index + 1} урок</Text>
            <View style={{ flex: 1, gap: 20, alignItems: 'center' }}>
              {lesson.lectures_data.map((lecture) => (
                <TouchableOpacity
                  key={lecture.id}
                  onPress={() => openPDF(lecture)}
                  style={CourseStyle.buttonContainer}
                >
                  <FontAwesomeIcon icon={faFilePdf} size={18} color="#000" />
                  <Text style={CourseStyle.buttonText}>{lecture.name}</Text>
                  <View style={CourseStyle.indicatorWrapper}>
                    {completedLectures.has(lecture.id ?? 0) ? (
                      <FontAwesomeIcon icon={faCheck} style={CourseStyle.checked} />
                    ) : (
                      <View style={CourseStyle.circle} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {lesson.video_lessons_data.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  onPress={() => openVideo(video)}
                  style={CourseStyle.buttonContainer}
                >
                  <FontAwesomeIcon icon={faFilm} size={18} color="#000" />
                  <Text style={CourseStyle.buttonText}>{video.name}</Text>
                  <View style={CourseStyle.indicatorWrapper}>
                    {completedLectures.has(video.id ?? 0) ? (
                      <FontAwesomeIcon icon={faCheck} style={CourseStyle.checked} />
                    ) : (
                      <View style={CourseStyle.circle} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {lesson.test_data.map((test) => (
                <TouchableOpacity
                  key={test.id}
                  onPress={() => openTest(test)}
                  style={CourseStyle.buttonContainer}
                >
                  <FontAwesomeIcon icon={faGraduationCap} size={18} color="#000" />
                  <Text style={CourseStyle.buttonText}>{test.name}</Text>
                  <View style={CourseStyle.indicatorWrapper}>
                    {completedLectures.has(test.id ?? 0) ? (
                      <FontAwesomeIcon icon={faCheck} style={CourseStyle.checked} />
                    ) : (
                      <View style={CourseStyle.circle} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {index < week.lessons_data.length - 1 && (
            <View style={CourseStyle.divider} />
          )}
        </React.Fragment>
      ))}
    </ScrollView>
  </View>
)}


{selectedVideo && (
  <Modal visible={isModalVisible} animationType="slide" onRequestClose={closeVideo}>
    <VideoPlayer
      videoData={{
        video_480: selectedVideo.video_480 || '',
        video_720: selectedVideo.video_720 || '',
        video_1080: selectedVideo.video_1080 || '',
      }}
      videoName={selectedVideo.name}
      description={selectedVideo.description || ''}
      onComplete={closeVideo}
    />
  </Modal>
)}


          {selectedLecture && (
            <Modal visible={isPDFVisible} animationType="slide" onRequestClose={closePDF}>
              <SafeAreaView style={{ flex: 1 }}>
                <WebView source={{ uri: selectedLecture.file || '' }} />
                <View style={CourseStyle.pdfControls}>
                  <TouchableOpacity onPress={closePDF} style={CourseStyle.backBtn}>
                    <Text>Назад</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={finishPDF} style={CourseStyle.backBtn}>
                    <Text>Завершить</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </Modal>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Week;
