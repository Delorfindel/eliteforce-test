import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Animated, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Heading, MutedText, UIText } from "@/components/ui/text";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { listCategories } from "@/features/services/api/list-categories";
import { listTopProviderServices } from "@/features/services/api/list-top-provider-services";
import { CategoryGrid } from "@/features/services/components/category-grid";
import { ServiceCard } from "@/features/services/components/service-card";
import { Pressable, View } from "@/tw";

const HEADER_FULL = 170;
const HEADER_COMPACT = 120;

export default function HomeRoute() {
  const router = useRouter();
  const { profile } = useAuthSession();
  const insets = useSafeAreaInsets();
  const categoriesQuery = useQuery({
    queryFn: listCategories,
    queryKey: ["service-categories"]
  });
  const topServicesQuery = useQuery({
    queryFn: listTopProviderServices,
    queryKey: ["top-provider-services"]
  });

  const scrollY = React.useRef(new Animated.Value(0)).current;

  // The total available scroll distance before the header is fully compact
  const scrollDistance = HEADER_FULL - HEADER_COMPACT;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, scrollDistance],
    outputRange: [HEADER_FULL, HEADER_COMPACT],
    extrapolate: "clamp"
  });

  const greetingOpacity = scrollY.interpolate({
    inputRange: [0, scrollDistance / 2],
    outputRange: [1, 0],
    extrapolate: "clamp"
  });

  const greetingTranslateY = scrollY.interpolate({
    inputRange: [0, scrollDistance],
    outputRange: [0, -15],
    extrapolate: "clamp"
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, scrollDistance],
    outputRange: [0, -20],
    extrapolate: "clamp"
  });

  const headerContent = (
    <Animated.View
      style={{
        backgroundColor: "#FFFFFF",
        borderBottomColor: "#E5E5E5",
        borderBottomWidth: 0.5,
        height: headerHeight,
        paddingHorizontal: 20,
        paddingTop: insets.top,
        zIndex: 10
      }}
    >
      <View className="flex-1 justify-end pb-3">
        <Animated.View
          style={{
            opacity: greetingOpacity,
            transform: [{ translateY: greetingTranslateY }]
          }}
        >
          <MutedText className="text-sm">
            {`Bonjour${profile?.first_name ? `, ${profile.first_name}` : ""} 👋`}
          </MutedText>
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: titleTranslateY }] }}>
          <Heading className="text-[22px] leading-8">Que cherchez-vous ?</Heading>
        </Animated.View>

        <Pressable
          className="mt-3 flex-row items-center gap-3 rounded-full bg-brand-sand-strong px-5 py-3"
          onPress={() => router.push("/search")}
        >
          <MaterialCommunityIcons color="#A3A3A3" name="magnify" size={20} />
          <MutedText className="text-sm">Plomberie, ménage, montage...</MutedText>
        </Pressable>
      </View>
    </Animated.View>
  );

  const sections = React.useMemo(() => {
    const items: Array<{ key: string; type: "categories" | "services" }> = [
      { key: "categories", type: "categories" },
      { key: "services", type: "services" }
    ];
    return items;
  }, []);

  return (
    <View className="flex-1 bg-brand-sand">
      {headerContent}

      <FlatList
        contentContainerStyle={{ paddingBottom: 32 }}
        data={sections}
        keyExtractor={(item) => item.key}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => {
          if (item.type === "categories") {
            return (
              <View className="mt-6 gap-4">
                <View className="flex-row items-center justify-between px-5">
                  <UIText className="text-lg font-semibold">Catégories</UIText>
                  <Pressable hitSlop={8} onPress={() => router.push("/search")}>
                    <UIText className="text-sm font-semibold text-brand-clay">Tout voir</UIText>
                  </Pressable>
                </View>
                <View className="px-5">
                  <CategoryGrid
                    categories={categoriesQuery.data ?? []}
                    onSelectCategory={(category) =>
                      router.push({
                        pathname: "/search",
                        params: { categoryId: String(category.id) }
                      })
                    }
                  />
                </View>
              </View>
            );
          }

          return (
            <View className="mt-6 gap-4">
              <View className="flex-row items-center justify-between px-5">
                <UIText className="text-lg font-semibold">Top services</UIText>
                <UIText className="text-sm text-brand-ink-soft">Les mieux notés</UIText>
              </View>
              <FlatList
                contentContainerStyle={{ paddingHorizontal: 20 }}
                data={topServicesQuery.data ?? []}
                horizontal
                keyExtractor={(s) => String(s.id)}
                renderItem={({ item: s }) => (
                  <View className="mr-4">
                    <ServiceCard
                      onPress={() => router.push(`/services/${s.slug}`)}
                      service={s}
                      variant="featured"
                    />
                  </View>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          );
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
