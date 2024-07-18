import { createContext, useContext, useEffect, useState } from "react";

import { EMISSION_CATEGORIES } from "../config/constants";
import useUserDocumentListener from "../hooks/useUserDocumentListener";

const MonthlyActivityContext = createContext(null);
export const useMonthlyActivity = () => {
  const list = useContext(MonthlyActivityContext);
  return list;
};

const currentMonthIndex = new Date().getMonth();

export const MonthlyActivityProvider = ({ children }) => {
  const user = useUserDocumentListener();
  const [list, setList] = useState(null);

  useEffect(() => {
    let combinedList;
    if (user) {
      const currentMonth = user.monthly[currentMonthIndex + 1];
      const emissionsArr = currentMonth.emissions;
      const offsetsArr = currentMonth.offsets;
      combinedList = emissionsArr.concat(offsetsArr);
      combinedList = combinedList.map((activity) => {
        const isEmissions = EMISSION_CATEGORIES.includes(activity.category);
        return {
          ...activity,
          isEmissions,
        };
      });
      combinedList.sort((a, b) => b.timestamp - a.timestamp);
      setList(combinedList);
    }
  }, [user]);

  return (
    <MonthlyActivityContext.Provider value={list}>
      {children}
    </MonthlyActivityContext.Provider>
  );
};
