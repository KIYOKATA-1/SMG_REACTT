import { StyleSheet } from 'react-native';

export const CourseStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  courseContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    display: 'flex',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#263546',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    marginBottom: 40,
    marginTop: 10,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#F2277E',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  weekContainer: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: '#202942',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1, 
  },
  
  weekHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#0C0E2B',
    alignItems: 'center',
  },
  weekText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  lessonContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0C0E2B',
    flexGrow: 1, 
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  
  lessonItem: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    gap: 10, 
  },
  
  lessonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10, 
    textAlign: 'left', 
  },
  
  contentWrapper: {
    borderWidth: 1,
    borderColor: '#263546',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F5',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%', 
    flexWrap: 'nowrap', 
  },
  
  buttonText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    marginLeft: 10,
  },
  indicatorWrapper: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  checked: {
    color: '#46BD84',
  },
  pdfControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  backBtn: {
    width: 150,
    height: 40,
    marginBottom: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0C0E2B',
    borderRadius: 20,
    marginLeft: 10,
  },
  divider:{
    width: '100%',
    height: 2,
    backgroundColor: '#0C0E2B',
    marginBottom: 10,
  }
});
