import { StyleSheet, TextInput} from "react-native";

const styles = StyleSheet.create({
    mainContainer:{
        backgroundColor: 'white'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    smallIcon:{
        marginRight: 10,
        fontSize: 24
    },
    logoContainer:{
        justifyContent: 'center',
        alignItems:'center'
    },
    logo:{
        height: 260,
        width: 260,
        marginTop: 30,
    },
    text_footer:{
        color: '#055240',
        fontSize: 18
    },
    action:{
        flexDirection: 'row',
        paddingTop: 14,
        paddingBottom: 3,
        marginTop: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#055240',
        borderRadius: 20,
        width: '85%'
    },
    textInput:{
        flex: 1,
        marginTop: -10,
        color: '#05375a'
    },
    loginContainer:{
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    header:{
        justifyContent:'flex-end',
        paddingHorizontal: 20
    },
    text_header:{
        color: '#055240',
        fontWeight: 'bold',
        fontSize: 30
    },
    button:{
        alignItems:'center',
        marginTop: 10,
        textAlign: 'center',
    },
    inBut:{
        backgroundColor: '#055240',
        alignItems: 'center',
        paddingHorizontal: 65,
        paddingVertical: 15,
        borderRadius: 20,
    },
    signupText:{
        color: 'red',
        fontSize: 16,
        fontWeight: '600',
    },
    radioButton_div:{
        flexDirection: 'row',
        width:'85%',
        justifyContent:'space-evenly',
    },
    radioButton_inner_div:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
        
    },
    radio_btn_text:{
        color: '#000',
    },
    smalltextContainer:{
        justifyContent:"center",
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 30
    },
    smallText:{
        fontSize: 15
    },
    smallTextLink:{
        fontSize: 17,
        color: '#f04646',
        fontWeight: 'bold'
    },
    dropdown:{
        paddingTop: 10,
        marginTop: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#055240',
        borderRadius: 15,
        width: '90%',
        marginLeft: 18,
        height: 50,
        
        
    },
    dropdownContainer:{
        position: 'relative',
    },
    ddcontainer:{
        flex: 1,
    },
    eyeIcon:{
        justifyContent: 'center',
        marginTop: 5,
    }
})
export default styles;