import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StackNavigationProp } from '@react-navigation/stack'; 
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import IMAGES from "../../../assets/img/image";

type RootStackParamList = {
  Login: undefined;
};

export default function CustomDrawerContent(props: any) {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <DrawerContentScrollView {...props} scrollEnabled={false}>
            <View style={styles.imageContainer}>
                <Image 
                    source={IMAGES.LOGIN_LOGO} 
                    style={styles.logo} 
                />
            </View>
            <DrawerItemList {...props} />
            <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={() => navigation.replace("Login")}
            >
                <Text style={styles.logoutLabel}>LOGOUT</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        alignSelf: 'center',
        resizeMode: 'contain',
        width: '70%',
        marginBottom: 20,
        right: 20,
        position: 'relative',
    },
    logoutButton: {
        backgroundColor: '#F2277E',
        borderRadius: 8,
        width: 200,
        height: 50, 
        justifyContent: 'center', 
        alignItems: 'center', 
        alignSelf: 'center',
        marginTop: 20, 
    },
    logoutLabel: {
        color: '#fff', 
        fontSize: 16,
        fontWeight: 'bold',
    },
});
