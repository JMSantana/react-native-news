import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { format, parseISO } from "date-fns";

interface Match {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  strTime: string;
  strStatus: string;
}

const formatMatchTime = (timeString: string) => {
  try {
    // Extract just the time part (HH:mm:ss) from the string
    const timePart = timeString.split("+")[0];
    // Create a date object for today with the time
    const [hours, minutes] = timePart.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    // Format to show only hours and minutes
    return format(date, "HH:mm");
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeString;
  }
};

export default function LiveMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const response = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}&s=Soccer`
      );
      const data = await response.json();

      if (data.events) {
        console.log("Sample time string:", data.events[0]?.strTime); // Debug log
        setMatches(data.events);
      } else {
        setMatches([]);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch matches");
      console.error("Error fetching matches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    // Poll every 5 minutes
    const interval = setInterval(fetchMatches, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const renderMatch = ({ item }: { item: Match }) => (
    <View style={styles.matchContainer}>
      <View style={styles.matchHeader}>
        <Text style={styles.matchTime}>{formatMatchTime(item.strTime)}</Text>
        <Text style={styles.status}>{item.strStatus}</Text>
      </View>
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Text style={styles.teamName} numberOfLines={1}>
            {item.strHomeTeam}
          </Text>
        </View>
        <View style={styles.vsContainer}>
          <Text style={styles.vs}>VS</Text>
        </View>
        <View style={styles.teamContainer}>
          <Text style={styles.teamName} numberOfLines={1}>
            {item.strAwayTeam}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Matches</Text>
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.idEvent}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  listContainer: {
    padding: 12,
  },
  matchContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  matchTime: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  teamContainer: {
    flex: 1,
    alignItems: "center",
  },
  teamName: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  vsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  vs: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
  },
  status: {
    fontSize: 13,
    color: "#2196F3",
    fontWeight: "600",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
