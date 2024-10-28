import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get('window');

export const ProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    gap: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#5F2DED',
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    shadowColor: '#260094',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5.84,
    borderWidth: 1,
    borderColor: '#260094',
  },
  userData: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 5,
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
    backgroundColor: '#5F2DED',
    borderRadius: 30,
    padding: 20,
    height: '100%',
    maxHeight: height * 0.5, 
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    borderWidth: 1,
    borderColor: '0 0 1px 1px rgba(95, 45, 237, 0.2)',
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
    marginBottom: 10,
    backgroundColor: '#F0F0F5',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000'
  },
  course: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  groupImage:{
    height: 40,
     width: 80, 
     objectFit: 'contain',
     position: 'relative',
    marginVertical: 5,
  }
});
