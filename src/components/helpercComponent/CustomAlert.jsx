import React, { useEffect } from 'react';
import { BackHandler, View, Text, TouchableOpacity } from 'react-native';

const CustomAlert = ({ visible, message, onCancel, onConfirm }) => {
    if (!visible) return null;

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                <Text>{message}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                    <TouchableOpacity onPress={onCancel} style={{ padding: 10, backgroundColor: 'red', borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onConfirm} style={{ padding: 10, backgroundColor: 'green', borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>YES</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


const App = () => {
    useEffect(() => {
        const backAction = () => {
            setAlertVisible(true);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const [alertVisible, setAlertVisible] = useState(false);

    const handleCancel = () => {
        setAlertVisible(false);
    };

    const handleConfirm = () => {
        BackHandler.exitApp();
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CustomAlert
                visible={alertVisible}
                message="Are you sure you want to exit?"
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
        </View>
    );
};

export default App;
