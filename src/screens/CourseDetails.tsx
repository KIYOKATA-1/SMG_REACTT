import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, Modal, ActivityIndicator, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { CourseService } from '../../services/course/course.service';
import { ICourseDetails, ContentData } from '../../services/course/course.types';
import { CourseStyle } from '../../styles/Course';
import { useSession } from '../../lib/useSession';
import Week from '../../components/Week';

type RootStackParamList = {
  CourseDetails: { courseId: number };
};

type CourseDetailsRouteProp = RouteProp<RootStackParamList, 'CourseDetails'>;

const CourseDetailsScreen: React.FC = () => {
  const route = useRoute<CourseDetailsRouteProp>();
  const { courseId } = route.params;
  const { getSession } = useSession();

  const [course, setCourse] = useState<ICourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    try {
      const session = await getSession();
      if (!session) {
        Alert.alert('Ошибка', 'Сессия не найдена. Войдите снова.');
        return;
      }

      const data = await CourseService.getCourseById(session.key, courseId.toString());
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
  {course?.course_weeks?.map((week) => (
    <Week 
      key={week.id || week.week_number} 
      week={week} 
      courseId={courseId} 
    />
  ))}
</ScrollView>

  );

  if (loading) {
    return (
      <View style={CourseStyle.loader}>
        <ActivityIndicator size="large" color="#263546" />
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
      {renderSyllabus()}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              {selectedContent?.name}
            </Text>
            <Text>{selectedContent?.description}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default CourseDetailsScreen;