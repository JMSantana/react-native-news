import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NewsList } from "./features/news/NewsList";
import { RootStackParamList } from "./types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="NewsList"
            component={NewsList}
            options={{
              title: "Sports News",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
