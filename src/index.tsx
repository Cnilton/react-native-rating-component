import React, {FC, useState, cloneElement, useEffect, useRef} from 'react';
import {
  PanResponder,
  PanResponderInstance,
  Animated,
  TouchableWithoutFeedback,
  View,
  Image,
  LayoutChangeEvent,
} from 'react-native';
import {styles} from './styles';

const Star = require('./assets/star.png');

interface Props {
  /** Custom height of each star */
  customHeight?: number;
  /** Custom width of each star */
  customWidth?: number;
  /** Fill color of active stars */
  fillColorActive?: string;
  /** Sets the initial value of active stars */
  fillColorInactive?: string;
  /** Callback for changing rating value */
  initialValue?: number;
  /** Callback for changing rating value */
  onChangeValue?: (value: number) => {};
  /** Sets how many stars should be listed */
  minimumStars?: number;
  /** Sets how many stars should be listed */
  starCount?: number;
  /** Set your custom component for rating. Make sure to use the prop "fill" for proper colloring the rating */
  CustomRatingComponent?: React.ReactElement;
  /** Horizontal Distance between each star */
  distance?: number;
}

const Rating: FC<Props> = ({
  customHeight,
  customWidth,
  fillColorActive,
  fillColorInactive,
  initialValue,
  onChangeValue,
  minimumStars,
  starCount,
  CustomRatingComponent,
  distance,
}: Props) => {
  const isFirstRun = useRef(true);
  const [rate, setRate] = useState(initialValue);
  const [componentWidth, setComponentWidth] = useState(0);
  const [previousRate, setPreviousRate] = useState(initialValue);

  const panResponder: PanResponderInstance = PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderStart: ({nativeEvent}) => {
      const location = nativeEvent.locationX;
      const points = componentWidth / starCount;
      const newValue = location / points;

      if (location > componentWidth) {
        return;
      }
      if (newValue <= minimumStars) {
        if (rate !== minimumStars) {
          setRate(minimumStars);
        }
        return;
      }
      setPreviousRate(rate);
      setRate(
        newValue > Math.round(newValue)
          ? Math.round(newValue) + 1
          : Math.round(newValue),
      );
    },
    onPanResponderMove: ({nativeEvent}) => {
      // The most recent move distance is gestureState.move{X,Y}
      // The accumulated gesture distance since becoming responder is
      // gestureState.d{x,y}
      const location = nativeEvent.locationX;
      const points = componentWidth / starCount;
      const newValue = location / points;

      if (location > componentWidth) {
        return;
      }
      if (newValue <= minimumStars) {
        if (rate !== minimumStars) {
          setRate(minimumStars);
        }
        return;
      }
      setPreviousRate(rate);
      setRate(
        newValue > Math.round(newValue)
          ? Math.round(newValue) + 1
          : Math.round(newValue),
      );

      // if(moveX/starCount){
      // setPreviousRate(rate);
      // setRate(componentWidth*10/moveX);
      // }

      // if (Math.fround(Math.abs(dx) / (customWidth + distance)) > 0) {
      //   const newValue = Math.fround(dx / (customWidth + distance)) + rate;
      //   if (newValue <= minimumStars || Math.floor(newValue) > starCount) {
      //     return;
      //   }
      //   // setPreviousRate(rate);
      //   // setRate(newValue);
      // }
    },
  });

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (Math.floor(rate) === Math.floor(previousRate)) {
      return;
    }

    onChangeValue?.(Math.floor(rate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= starCount; i += 1) {
      stars.push(i);
    }

    return stars.map((star, index) => (
      <View
        pointerEvents="none"
        // delayLongPress={1}
        key={String(star)}

        // onLongPress={() => {
        //   setPreviousRate(rate);
        //   setRate(star);
        // }}
        // onPress={() => {
        //   setPreviousRate(rate);
        //   setRate(star);
        // }}
      >
        <View style={index < starCount - 1 && {paddingRight: distance}}>
          {CustomRatingComponent ? (
            <View style={[index < stars.length - 1 && {marginRight: distance}]}>
              {cloneElement(CustomRatingComponent, {
                fill: rate >= star ? fillColorActive : fillColorInactive,
              })}
            </View>
          ) : (
            <Image
              resizeMethod="resize"
              source={Star}
              style={[
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  tintColor: rate >= star ? fillColorActive : fillColorInactive,
                  height: customHeight,
                  width: customWidth,
                  resizeMode: 'contain',
                },
              ]}
            />
          )}
        </View>
      </View>
    ));
  };

  function handleLayout(evt: LayoutChangeEvent) {
    setComponentWidth(evt.nativeEvent.layout.width);
  }

  return (
    <Animated.View
      style={[styles.container]}
      onLayout={(evt: any) => handleLayout(evt)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...panResponder.panHandlers}>
      {renderStars()}
    </Animated.View>
  );
};

Rating.defaultProps = {
  customHeight: 30,
  customWidth: 30,
  fillColorActive: 'yellow',
  fillColorInactive: 'gray',
  initialValue: 3,
  onChangeValue: undefined,
  minimumStars: 1,
  starCount: 5,
  CustomRatingComponent: undefined,
  distance: 10,
};

export type {Props};
export default Rating;
