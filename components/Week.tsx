import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, Text, TouchableOpacity, LayoutAnimation, Animated, SafeAreaView, Modal, ScrollView 
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilm, faFilePdf, faCheck, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { ContentData, ICourseWeek, TestData } from '../services/course.types';
import { CourseStyle } from '../styles/Course';
import { useSession } from '../lib/useSession';
import { CourseService } from '../services/course.service';
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
    const fetchCompletedLectures = async () => {
      const session = await getSession();
      if (session) {
        const completed = new Set(
          week.lessons_data.flatMap((lesson) =>
            [...lesson.lectures_data, ...lesson.video_lessons_data]
              .filter((content) => content.is_ended)
              .map((content) => content.id)
          )
        );
        setCompletedLectures(completed);
      }
    };
    fetchCompletedLectures();
  }, [week, getSession]);

  const markAsCompleted = useCallback(
    async (content: ContentData) => {
      const session = await getSession();
      if (!session) return;

      try {
        await CourseService.endLessonContent(session.key, content.id);
        setCompletedLectures((prev) => new Set(prev).add(content.id));
      } catch (error) {
        console.error('Ошибка завершения контента:', error);
      }
    },
    [getSession]
  );

  const openVideo = (video: ContentData) => {
    setSelectedVideo(video);
    setIsModalVisible(true);
  };

  const closeVideo = () => {
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
              {week.lessons_data.map((lesson, index) => (
                <View key={lesson.id} style={CourseStyle.lessonItem}>
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
                          {completedLectures.has(lecture.id) ? (
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
                          {completedLectures.has(video.id) ? (
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
              ))}
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
