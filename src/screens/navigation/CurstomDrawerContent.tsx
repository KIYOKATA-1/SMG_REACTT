import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StackNavigationProp } from '@react-navigation/stack'; 
import LoginScreen from "../LoginScreen";
import { View , Image} from "react-native";
import IMAGES from "../../../assets/img/image";

type RootStackParamList = {
  Login: undefined;
};

export default function CustomDrawerContent(props: any) {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <DrawerContentScrollView {...props} scrollEnabled={false}
        >
            <View style={{display: 'flex', width: '100%'}}>
                <Image source={IMAGES.LOGIN_LOGO} style={{ width: '100%',alignSelf: 'center', objectFit: 'cover'}}/>
            </View>
            <DrawerItemList {...props} />
            <DrawerItem label="LOGOUT" onPress={() => navigation.replace("Login")} />
        </DrawerContentScrollView>
    );
}
