import {Dimensions, StyleSheet} from 'react-native';

const height = Dimensions.get('window').height * 1;
export default StyleSheet.create({
  loading: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    height: 1000,
  },
  button: {
    alignItems: 'center',
    marginTop: 0,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 30,
  },
  textSign: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  inBut: {
    backgroundColor: '#00634B',
    alignItems: 'center',
    borderRadius: 8,
    width: '95%',
    paddingVertical: 10
  },
  header: {
    backgroundColor: '#00634B',
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -5,
  },
  camDiv: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  camIconDiv: {
    position: 'absolute',
    right: 142,
    zIndex: 1,
    bottom: 5,
    height: 40,
    width: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  cameraIcon: {
    color: '#00634B',
  },
  backIcon: {
    marginLeft: 20,
    color: 'white',
  },
  nameText: {
    color: 'white',
    fontSize: 24,

    fontStyle: 'normal',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoEditView: {
    // marginTop: 10,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    borderColor: '#e6e6e6',
    borderBottomWidth: 1,
    // paddingBottom: -5,
    marginBottom: 10
  },
  infoEditFirst_text: {
    color: '#7d7c7c',
    fontSize: 15,
    fontWeight: '400',
  },
  infoEditSecond_text: {
    color: 'black',
    // fontStyle: 'normal',
    // fontFamily: 'Open Sans',
    fontSize: 20,
    textAlignVertical: 'center',
    // textAlign: 'right',
    fontWeight: '600'
  },
  profileImage:{
    height: 170,
    width: 170,
    borderRadius: 100,
  },
  profileImageView:{
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagesButton:{
    backgroundColor: '#00634B',
    borderRadius: 8,
    width: 100,
  },
  buttonText:{
    color: 'white',
    fontSize: 16,
  }, 
  serviceImages:{
    width: 100,
    height: 100,
    margin: 5
  },
  deleteIconView:{
    position: 'absolute',
    backgroundColor: 'black',
    margin: 5,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5 
  },
  eyeIcon:{
    justifyContent: 'center',
    
  }
});