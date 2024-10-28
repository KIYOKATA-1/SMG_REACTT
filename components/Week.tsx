import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Animated } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilePdf, faFilm, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ContentData, ICourseWeek } from '../services/course.types';
import { CourseStyle } from '../styles/Course';
import { useSession } from '../lib/useSession';
import { CourseService } from '../services/course.service';
import ProgressBar from '../components/ProgressBar';

interface WeekProps {
  week: ICourseWeek;
  courseId: number;
  openContent: (content: ContentData) => void;
}

const Week: React.FC<WeekProps> = ({ week, courseId, openContent }) => {
  const { getSession } = useSession();
  const [expanded, setExpanded] = useState(false);
  const [completedLectures, setCompletedLectures] = useState<Set<number>>(new Set());
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[CourseStyle.weekContainer, { opacity: fadeAnim }]}>
      <TouchableOpacity style={CourseStyle.weekHeader} onPress={toggleExpand}>
        <Text style={CourseStyle.weekText}>{week.name}</Text>
        <ProgressBar size={50} progress={week.user_week_completion || 0} textSize={12} />
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={CourseStyle.lessonContainer}>
          {week.lessons_data.map((lesson, index) => (
            <Animated.View key={lesson.id} style={[CourseStyle.lessonItem, { opacity: fadeAnim }]}>
              <Text style={CourseStyle.lessonText}>{index + 1} урок</Text>
              <View style={{ flex: 1, gap: 20, alignItems: 'baseline' }}>
                {lesson.lectures_data.map((lecture) => (
                  <View key={lecture.id} style={CourseStyle.contentWrapper}>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                      <TouchableOpacity
                        onPress={() => openContent(lecture)}
                        style={CourseStyle.lectureBtn}
                      >
                        <FontAwesomeIcon icon={faFilePdf} size={18} color="#000" />
                        <Text style={CourseStyle.contentText}>{lecture.name}</Text>
                      </TouchableOpacity>
                      {!completedLectures.has(lecture.id) ? (
                        <TouchableOpacity
                          onPress={() => markAsCompleted(lecture)}
                          style={CourseStyle.completeButton}
                        >
                          <Text></Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={CourseStyle.completedIconWrapper}>
                          <FontAwesomeIcon icon={faCheck} style={CourseStyle.checked} />
                        </View>
                      )}
                    </View>
                  </View>
                ))}

                {lesson.video_lessons_data.map((video) => (
                  <View key={video.id} style={CourseStyle.contentWrapper}>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                      <TouchableOpacity
                        onPress={() => openContent(video)}
                        style={CourseStyle.lectureBtn}
                      >
                        <FontAwesomeIcon icon={faFilm} size={18} color="#000" />
                        <Text style={CourseStyle.contentText}>{video.name}</Text>
                      </TouchableOpacity>
                      {!completedLectures.has(video.id) ? (
                        <TouchableOpacity
                          onPress={() => markAsCompleted(video)}
                          style={CourseStyle.completeButton}
                        >
                          <Text></Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={CourseStyle.completedIconWrapper}>
                          <FontAwesomeIcon icon={faCheck} style={CourseStyle.checked} />
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </Animated.View>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default Week;
