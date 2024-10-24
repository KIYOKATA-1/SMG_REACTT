import { StyleSheet } from "react-native";
export const LoginStyle = StyleSheet.create({
  container: {
    flex: 1, 
  },
  loginContainer: {
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    paddingVertical: 0,
    alignItems: 'center',
    display: 'flex',
    position: 'relative',
  },
  imageContainer:{
    position: 'relative',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    position: 'relative',
    objectFit: 'contain',
    width: 200,
    height: 200,
  },
  inputContainer: {
    gap: 30,
    width: '100%',
    height: 'auto',
    gap: 50,
    display: 'flex',
    paddingHorizontal: 20,
  },
  input:{
    backgroundColor: '#F3F3F3',
    width: '100%',
    borderWidth: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 30,
    fontSize: 18,
  },
  loginBtn:{
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
    width: '70%',
    height: 50,
    paddingHorizontal: 30,
  },
  btnText:{
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
