import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  SafeAreaView, 
  Animated, 
  LayoutAnimation, 
  Platform, 
  UIManager, 
  Modal 
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { CourseService } from '../../services/course.service';
import { ICourseDetails, ContentData } from '../../services/course.types';
import { CourseStyle } from '../../styles/Course';
import { WebView } from 'react-native-webview';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilePdf, faFilm, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

// Включаем LayoutAnimation для Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type RootStackParamList = {
  CourseDetails: { courseId: number; token: string };
};

type CourseDetailsRouteProp = RouteProp<RootStackParamList, 'CourseDetails'>;

const CourseDetailsScreen = () => {
  const route = useRoute<CourseDetailsRouteProp>();
  const navigation = useNavigation();
  const { courseId, token } = route.params;

  const [course, setCourse] = useState<ICourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'unscheduledTest'>('syllabus');

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CourseService.getCourseById(token, courseId.toString());
      setCourse(data);
    } catch (error) {
      console.error('Ошибка при загрузке курса:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить курс. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }, [courseId, token]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const openContent = (content: ContentData) => {
    setSelectedContent(content);
    setIsModalVisible(true);
  };

  const renderContent = () => {
    if (!selectedContent) return <Text>Контент недоступен</Text>;

    const videoUrl = `https://api.smg.kz/en/api/course/${courseId}/videoLesson/${selectedContent.id}`;
    
    return selectedContent.type === 2 ? (
      <WebView
        source={{ uri: videoUrl }}
        style={{ width: '100%', height: 300 }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="#7C77C6" />}
        onError={() => Alert.alert('Ошибка', 'Не удалось загрузить видео.')}
      />
    ) : (
      <WebView
        source={{ uri: selectedContent.file || '' }}
        style={{ flex: 1 }}
        onError={() => Alert.alert('Ошибка', 'Не удалось загрузить PDF.')}
      />
    );
  };

  const toggleWeek = (weekId: number | null) => {
    if (weekId === null) return; 
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedWeek((prevExpandedWeek) => (prevExpandedWeek === weekId ? null : weekId));
  };

  const renderSyllabus = () => (
    <ScrollView>
      {(course?.course_weeks ?? []).map((week) => (
        <View key={week.id} style={CourseStyle.weekContainer}>
          <TouchableOpacity 
            style={CourseStyle.weekHeader} 
            onPress={() => toggleWeek(week.id)}
          >
            <Text style={CourseStyle.weekText}>{week.name}</Text>
          </TouchableOpacity>
          {expandedWeek === week.id && (
            <Animated.View style={CourseStyle.lessonContainer}>
              {week.lessons_data.map((lesson, index) => (
                <View key={lesson.id} style={CourseStyle.lessonItem}>
                  <Text style={CourseStyle.lessonText}>{index + 1} урок</Text>
                  <View style={{ flex: 1, paddingLeft: 50, gap: 15, }}>
                    {lesson.lectures_data.map((lecture) => (
                      <TouchableOpacity 
                        key={lecture.id} 
                        onPress={() => openContent(lecture)}
                        style={CourseStyle.lectureBtn}
                      >
                        <FontAwesomeIcon icon={faFilePdf} size={18} color="#000" />
                        <Text style={CourseStyle.contentText}> {lecture.name}</Text>
                      </TouchableOpacity>
                    ))}
                    {lesson.video_lessons_data.map((video) => (
                      <TouchableOpacity 
                        key={video.id} 
                        onPress={() => openContent(video)}
                        style={CourseStyle.lectureBtn}
                      >
                        <FontAwesomeIcon icon={faFilm} size={18} color="#000" />
                        <Text style={CourseStyle.contentText}> {video.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </Animated.View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={CourseStyle.loader}>
        <ActivityIndicator size="large" color="#7C77C6" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={CourseStyle.container}>
        <Text style={{ color: 'red', textAlign: 'center', fontSize: 18 }}>
          Курс не найден
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={CourseStyle.container}>
      <View style={CourseStyle.courseHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={CourseStyle.backBtn}>
          <FontAwesomeIcon icon={faAngleLeft} size={24} color="#260094" />
        </TouchableOpacity>
        <Text style={CourseStyle.title}>{course.name}</Text>
      </View>

      <View style={CourseStyle.tabsContainer}>
        <TouchableOpacity 
          style={[
            CourseStyle.tabButton, 
            activeTab === 'syllabus' && CourseStyle.activeTab 
          ]}
          onPress={() => setActiveTab('syllabus')}
        >
          <Text style={CourseStyle.tabText}>Силлабус</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            CourseStyle.tabButton, 
            activeTab === 'unscheduledTest' && CourseStyle.activeTab
          ]}
          onPress={() => setActiveTab('unscheduledTest')}
        >
          <Text style={CourseStyle.tabText}>Внеплановый тест</Text>
        </TouchableOpacity>
      </View>

      <View style={CourseStyle.contentContainer}>
        {activeTab === 'syllabus' ? renderSyllabus() : <Text>Тесты недоступны</Text>}
      </View>

      <Modal 
        visible={isModalVisible} 
        animationType="slide" 
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{display: 'flex', height: '100%', width: '100%', paddingVertical: 20,}}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={[CourseStyle.backBtn, {width: 200, marginBottom: 5,}]}>
              <FontAwesomeIcon icon={faAngleLeft} size={24} color="#260094" />
            </TouchableOpacity>
            {renderContent()}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default CourseDetailsScreen;
