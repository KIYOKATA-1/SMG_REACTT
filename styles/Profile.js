import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get('window');

export const ProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    width: '90%',
    borderRadius: 18,
    backgroundColor: '#202942',
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    shadowColor: '#0C0E2B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5.84,
    borderWidth: 1,
    borderColor: '#0C0E2B',
  },
  userData: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 15,
  },
  expandedUserData: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  username: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  role: {
    fontSize: 18,
    color: '#fff',
  },
  sbjctList: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 18,
    padding: 0,
    height: '100%',
    maxHeight: height * 0.65, 
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  productItem: {
    padding: 10,
    width: '100%',
    marginVertical: 20,
    backgroundColor: '#202942',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#000'
  },
  course: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  groupImage: {
    height: 40,
    width: 80,
    objectFit: 'contain',
    position: 'relative',
    marginVertical: 5,
  },
  phone: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'thin',
  },
});
