import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  SafeAreaView, 
  Modal 
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { CourseService } from '../../services/course.service';
import { ICourseDetails, ContentData } from '../../services/course.types';
import { CourseStyle } from '../../styles/Course';
import { WebView } from 'react-native-webview';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useSession } from '../../lib/useSession';
import Week from '../../components/Week';

type RootStackParamList = {
  CourseDetails: { courseId: number };
};

type CourseDetailsRouteProp = RouteProp<RootStackParamList, 'CourseDetails'>;

const CourseDetailsScreen = () => {
  const route = useRoute<CourseDetailsRouteProp>();
  const navigation = useNavigation();
  const { courseId } = route.params;

  const { getSession } = useSession();
  const [course, setCourse] = useState<ICourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'unscheduledTest'>('syllabus');

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    try {
      const session = await getSession();
      if (!session) {
        Alert.alert('Ошибка', 'Сессия не найдена. Войдите снова.');
        return;
      }

      const { key } = session;
      const data = await CourseService.getCourseById(key, courseId.toString());
      setCourse(data);
    } catch (error) {
      console.error('Ошибка при загрузке курса:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить курс. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }, [courseId, getSession]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const openContent = (content: ContentData) => {
    setSelectedContent(content);
    setIsModalVisible(true);
  };

  const renderSyllabus = () => (
    <ScrollView>
      {(course?.course_weeks ?? []).map((week) => (
        <Week key={week.id} week={week} courseId={courseId} openContent={openContent} />
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
          <View style={{ flex: 1, paddingVertical: 20 }}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={CourseStyle.backBtn}>
              <FontAwesomeIcon icon={faAngleLeft} size={24} color="#260094" />
            </TouchableOpacity>
            <WebView
              source={{ uri: selectedContent?.file || '' }}
              style={{ flex: 1 }}
              onError={() => Alert.alert('Ошибка', 'Не удалось загрузить контент.')}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default CourseDetailsScreen;
