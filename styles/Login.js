import { StyleSheet } from "react-native";

export const LoginStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',   
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
    position: 'relative',
    display: 'flex',
    gap: 40
  },
  input: {
    backgroundColor: '#F3F3F3',
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    borderWidth: 1,
    borderColor: '0 0 1px 1px rgba(95, 45, 237, 0.2)',
    shadowRadius: 3.84,
  },
  loginBtn: {
    backgroundColor: '#000',
    borderRadius: 10,
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    borderWidth: 1,
    borderColor: '0 0 1px 1px rgba(95, 45, 237, 0.2)',
    shadowRadius: 3.84,
  },
  btnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
