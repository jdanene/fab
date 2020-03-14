import React from 'react';
import {StyleSheet, View} from 'react-native';
import LottieView from "lottie-react-native";
import { normalize} from "../../constants/styles"

export default class EmptyBox extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {loadLoader: false}
    }

    componentDidMount() {
        this._isMounted = true;

        if (this._isMounted) {
            this.animation.play();

            // load animation after a short timeout
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({loadLoader: true})
                }
            }, 0);
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            (
                <View style={styles.container}>
                    <View style={styles.animationContainer}>
                        <LottieView

                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={{
                                width: this.state.loadLoader ? normalize(200) : 0,
                                height: this.state.loadLoader ? normalize(200) : 0,
                                backgroundColor: 'transparent',
                            }}
                            source={require('../../assets/lottie/629-empty-box.json')}
                            // OR find more Lottie files @ https://lottiefiles.com/featured
                            // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
                        />
                    </View>
                </View>
            )
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: normalize(300),
        height: normalize(300)
    },
    animationContainer: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    buttonContainer: {},
});
