import { useAppTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import React, { memo, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const blurhash = "|rF?hV%2WCj[ayj[a|j[ayj[fQj[fQfQfQfQfQfQfQfQfQfQfQfQ";

type Props = {
  images: string[];
  height?: number;
  showIndicators?: boolean;
};

const HorizontalSlider: React.FC<Props> = ({
  images,
  height = 220,
  showIndicators = true,
}) => {
  const styles = useStyles();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

  if (!images?.length) return null;

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={[styles.container, { height }]}
      >
        {images.map((uri, index) => (
          <Image
            key={`HorizontalSliderImage-${index}`}
            source={{ uri }}
            style={[styles.image, { height }]}
            contentFit="cover"
            cachePolicy="disk"
            transition={200}
            placeholder={blurhash}
          />
        ))}
      </ScrollView>

      {showIndicators && (
        <View style={styles.indicatorContainer}>
          {images.map((_, index) => (
            <View
              key={`Indicator-${index}`}
              style={[styles.dot, activeIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      backgroundColor: theme.SecondarySystemBackground,
    },
    image: {
      width,
    },

    indicatorContainer: {
      position: "absolute",
      bottom: 10,
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.SystemBackground,
      marginHorizontal: 4,
    },

    activeDot: {
      backgroundColor: theme.Blue,
      width: 10,
      height: 10,
    },
  });
};
export default memo(HorizontalSlider);
