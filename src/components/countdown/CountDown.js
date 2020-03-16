import React, { useState, useEffect } from 'react';
import moment from "moment";
import { View } from 'react-native';
import { styles } from "./CountDownStyle";
import PropTypes from 'prop-types';
import StyledText from "../StyledText/StyledText";
import { colors, sizes } from "../../constants/styles"


/**
 * Displays the countdown clock of a outfit
 *
 * @param isFinished() - Callback when the room is done
 * @param startTime - ISO formatted finish time
 * @param prettyFormat - set to true if want something more human readable
 * @author jideanene2020@u.northwestern.edu
 */

const CountDown = ({ startTime, isFinished, prettyFormat }) => {

    let outfitStartTime = moment(startTime);
    let outfitEndTime = moment(startTime).add(24, 'hours');
    let outfitWarningTime = moment(startTime).add(24, 'hours').subtract(60, 'seconds');

    const [hasEnded, setHasEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(moment(startTime).diff(moment(), 'seconds'));
    const [isCloseToEnd, setIsCloseToEnd] = useState(false);

    const [hasLoaded, setHasLoaded] = useState(false);

    /**
     * Indicates  if time has run out
     * @param now - moment
     * @return {boolean}
     */
    const hasTimeRunOut = (now) => {
        setIsCloseToEnd(now.isSameOrAfter(outfitWarningTime));
        return (now.isAfter(outfitEndTime))
    };

    let anHourBefore = moment(startTime).add(23, 'hours');
    let twoHourBefore = moment(startTime).add(22, 'hours');

    const getPrettyFormat = () => {
        let now = moment();
        if (now.isSameOrBefore(twoHourBefore)) {
            return `${moment.utc(timeLeft * 1000).format('HH')} hours`
        }

        if (now.isSameOrBefore(anHourBefore)) {
            return `${moment.utc(timeLeft * 1000).format('HH')} hour`
        }

        return `${moment.utc(timeLeft * 1000).format('m')} mins`

    };


    useEffect(() => {



        if (hasTimeRunOut(moment())) {
            isFinished();
            setHasEnded(true);
            setHasLoaded(true);
        } else {
            const interval = setInterval(() => {
                let now = moment();
                if (hasTimeRunOut(now)) {
                    setHasEnded(true);
                    isFinished();
                    clearInterval(interval);
                    setHasLoaded(true);
                } else {
                    setTimeLeft(outfitStartTime.diff(moment(), 'seconds'));
                    setHasLoaded(true);
                }
            }, 500);
            return () => clearInterval(interval);
        }
    }, []
    );


    return (
        hasLoaded &&
        (<View style={styles.container}>
            <StyledText type="semibold" style={styles.title}>TIME LEFT</StyledText>
            <StyledText type="bold" style={
                {
                    ...styles.content,
                    color: isCloseToEnd && !hasEnded ? colors.general.hot_purple : '#414141',
                    fontSize: sizes.large.fontSize
                }

            }>{hasEnded ? 'COMPLETED' : (prettyFormat && !isCloseToEnd ? getPrettyFormat() : moment.utc(timeLeft * 1000).format('HH:mm:ss'))}</StyledText>
        </View>)
    );
};
CountDown.defaultProps = {
    finishTime: moment().add({ 'seconds': 30 }).toISOString()
};

CountDown.propTypes = {
    isFinished: PropTypes.func.isRequired,
};

export default CountDown;
