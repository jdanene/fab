import React from 'react';
import {StyleSheet, View} from 'react-native';
import LottieView from "lottie-react-native";
import {colors, normalize, sizes} from "../../constants/styles"
import StyledText from "../StyledText/StyledText";

export default class Loader extends React.Component {
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
            }, 500);
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    resetAnimation = () => {
        this.animation.reset();
        this.animation.play();
    };

    render() {
        return (
            (
                <View style={styles.container}>
                    <View style={styles.animationContainer}>
                        {this.state.loadLoader && <StyledText type={'bold'} size={sizes.medium.fontSize} style={{
                            color: colors.text.secondary.main,
                            left: normalize(110),
                            top: normalize(50),
                            position: 'absolute'
                        }}>Loading ...</StyledText>}
                        <LottieView

                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={{
                                width: this.state.loadLoader ? normalize(150) : 0,
                                height: this.state.loadLoader ? normalize(150) : 0,
                                backgroundColor: 'transparent',
                            }}
                            source={require('../../assets/lottie/lf30_editor_16ltIz.json')}
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
