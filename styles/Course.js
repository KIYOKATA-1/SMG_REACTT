import { StyleSheet, Dimensions } from 'react-native';

export const CourseStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
  },
  courseContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    display: 'flex',

  },
  title: {
    flex: 1, 
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  loader: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    color: '#260094',

  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    marginBottom: 40,
    marginTop: 10,
    width: '100%',
    display: 'flex',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#7C77C6',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  weekContainer: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#260094',
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  weekHeader: {
    padding: 15,
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderColor: '#260094',
    alignItems: 'center',
    display: 'flex',
  },
  weekText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  lessonContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#260094',
    display: 'flex',
  },
  lessonItem: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lessonText: {
    fontSize: 18,
    fontWeight: 'bold',
    display: 'flex',
    color: '#000',
    transform: [{ rotate: '-90deg' }], 

},
  contentContainer:{
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'space-between',
  },
  contentText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    paddingHorizontal: 10, 
    width: '100%',
    height: 60,
    borderBottomWidth: 2,
    borderBottomColor: '#260094',
    gap: 20,
  },
  
  backBtn:{
    position: 'relative', 
    width: 40,
    height: 40,
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#260094',
    borderRadius: 20,
    marginLeft: 10,
  },
  lectureBtn:{
    width: 250, 
    height: 50,  
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  contentWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#F9F9FB',
  },
  completeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    display: 'flex',
    backgroundColor: 'transparent',
    borderRadius: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    width: 30,
    height: 30,
    borderWidth: 2,
  },
  completedIconWrapper: {
    borderWidth: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4FD',
    width: 30,
    borderRadius: 30,
    height: 30,
    borderColor: '#00FF0A',
  },
  checked:{
    color: '#00FF0A'
  }
  
});