import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get('window');

export const ProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
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
    backgroundColor: '#260094',
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    backgroundColor: '#260094',
    borderRadius: 30,
    padding: 20,
    maxHeight: height * 0.5, // Половина высоты экрана
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  course: {
    fontSize: 16,
    color: '#260094',
    fontWeight: 'bold',
  },
});
