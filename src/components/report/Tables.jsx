import { View, Text, Icon } from "@gluestack-ui/themed";
import { MoveDown, MoveUp } from "lucide-react-native";
import { StyleSheet } from "react-native";

import {
  MONTH_NAMES,
  emissionLabels,
  offsetLabels,
} from "../../config/constants";

function MonthlySummary({ monthlyData }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, styles.header]}>Month</Text>
        <Text style={[styles.tableCell, styles.header]}>Emission</Text>
        <Text style={[styles.tableCell, styles.header]}>Offset</Text>
        <Text style={[styles.tableCell, styles.header]}>Total Credit</Text>
      </View>
      {Object.entries(monthlyData).map(([month, data]) => (
        <View key={month} style={styles.tableRow}>
          <Text style={styles.tableCell}>
            {MONTH_NAMES[month - 1].substring(0, 3)}
          </Text>
          <Text style={styles.tableCell}>{data.emissionTotal.toFixed(2)}</Text>
          <Text style={styles.tableCell}>{data.offsetTotal.toFixed(2)}</Text>
          <Text bold style={styles.tableCell}>
            {data.remainingBudget.toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );
}

function MonthActivity({ monthData }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, styles.header]}>Date</Text>
        <Text style={[styles.tableCell, styles.header, { flex: 3 }]}>Type</Text>
        <Text style={[styles.tableCell, styles.header, { textAlign: "right" }]}>
          Credit
        </Text>
      </View>
      {monthData.map((activity) => {
        const date = new Date(activity.timestamp).toLocaleDateString([], {
          dateStyle: "short",
        });
        const label = activity.type
          ? emissionLabels[activity.type]
          : offsetLabels[activity.category];

        return (
          <View key={activity.timestamp} style={styles.tableRow}>
            <Text style={styles.tableCell}>{date}</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{label}</Text>
            <Text bold style={[styles.tableCell, { textAlign: "right" }]}>
              {activity.value.toFixed(2)}
              {activity.isEmissions ? (
                <Icon as={MoveDown} strokeWidth={2} color="$red500" />
              ) : (
                <Icon as={MoveUp} strokeWidth={2} color="$green500" />
              )}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default { MonthlySummary, MonthActivity };

const styles = StyleSheet.create({
  table: {
    justifyContent: "center",
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
  header: {
    color: "gray",
    fontSize: 12,
  },
});
