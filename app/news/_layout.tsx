import { Stack } from "expo-router";

export default function NewsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTintColor: "#000000",
        headerBackTitle: "Back",
        // Hide the back button breadcrumb, we'll handling it in the NewsDetail screen
        headerLeft: () => null,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: "Article Details",
        }}
      />
    </Stack>
  );
}
