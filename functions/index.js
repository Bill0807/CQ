/* eslint-disable max-len */
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");

initializeApp();

const DAILY_BUDGET = 6.4;

exports.dailyDataTransfer = onSchedule("0 15 * * *", async () => {
  const db = getFirestore();
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();

  const today = new Date();
  const monthString = (today.getMonth() + 1).toString();

  snapshot.forEach(async (doc) => {
    if (!doc.exists) {
      return;
    }

    try {
      const userDocRef = doc.ref;
      const userData = doc.data();
      const todayData = userData.today;

      const batch = db.batch();

      const monthlyDocRef = userDocRef.collection("monthly").doc(monthString);
      const monthlyDoc = await monthlyDocRef.get();

      if (monthlyDoc.exists) {
        const monthlyDocData = monthlyDoc.data();
        const nextData = {
          remainingBudget:
            monthlyDocData.remainingBudget + todayData.remainingBudget,
          emissionTotal: monthlyDocData.emissionTotal + todayData.emissionTotal,
          offsetTotal: monthlyDocData.offsetTotal + todayData.offsetTotal,
          emissions: [...monthlyDocData.emissions, ...todayData.emissions],
          offsets: [...monthlyDocData.offsets, ...todayData.offsets],
        };

        const defaultTodayData = {
          "today.remainingBudget": DAILY_BUDGET,
          "today.emissionTotal": 0,
          "today.offsetTotal": 0,
          "today.emissions": [],
          "today.offsets": [],
          // Empty borrow requests past 24 hours
          "tickets.borrow": [],
        };

        batch.set(monthlyDocRef, nextData, { merge: true });
        batch.update(userDocRef, defaultTodayData);
      }

      await batch.commit();
    } catch (error) {
      console.error("Error in executing daily transfer", error);
    }
  });
});

exports.monthlySettlement = onSchedule("0 15 1 * *", async () => {
  try {
    const db = getFirestore();

    const today = new Date();
    const month = today.getMonth() + 1;
    const previousMonth = month - 1 || 12;

    const previousMonthString = previousMonth.toString();
    const currentMonthString = month.toString();

    const usersRef = db.collection("users");
    const pendingRef = db
      .collection("trades")
      .doc("lends")
      .collection("pending");

    const usersSnapshot = await usersRef.get();
    const pendingSnapshot = await pendingRef.get();

    const batch = db.batch();
    const updatePromises = [];

    // Settle monthly challenge credits
    usersSnapshot.forEach((doc) => {
      if (doc.exists) {
        const monthlyRef = doc.ref.collection("monthly");
        const previousMonthDocRef = monthlyRef.doc(previousMonthString);
        const monthlyDocRef = monthlyRef.doc(currentMonthString);

        updatePromises.push(
          previousMonthDocRef.get().then(async (prevMonthDoc) => {
            if (prevMonthDoc.exists && prevMonthDoc.data().challenge.date > 0) {
              // Increment remainingBudget by 10
              batch.update(previousMonthDocRef, {
                remainingBudget: FieldValue.increment(10),
                offsetTotal: FieldValue.increment(10),
                offsets: FieldValue.arrayUnion({
                  category: "challenge",
                  value: 10,
                }),
              });
            }

            // set default fields for the current month
            batch.set(monthlyDocRef, {
              remainingBudget: 0,
              emissionTotal: 0,
              offsetTotal: 0,
              emissions: [],
              offsets: [],
              challenge: {
                date: 0,
                where: "",
                who: "",
                learn: "",
              },
            });
          }),
        );
      }
    });

    // Settle monthly loans
    pendingSnapshot.forEach((doc) => {
      if (doc.exists) {
        // console.log(doc.id);
        const pendingDocRef = doc.ref;
        const { lenderId, amount } = doc.data();

        // Update lender doc and delete pending doc
        const lenderDocRef = db.collection("users").doc(lenderId);
        lenderDocRef.get().then((snapshot) => {
          if (snapshot.exists) {
            batch.update(lenderDocRef, {
              "today.remainingBudget": FieldValue.increment(Number(amount)),
              "tickets.lends": FieldValue.arrayRemove(doc.id),
            });
          }
        });

        batch.delete(pendingDocRef);
      }
    });

    await Promise.all(updatePromises);

    await batch.commit();
    console.log("Monthly tasks completed successfully");
  } catch (error) {
    console.error("Error in executing monthly tasks:", error);
  }
});

exports.monthlySettlementHttp = onRequest(async (req, res) => {
  try {
    const db = getFirestore();

    const today = new Date();
    const month = today.getMonth() + 1;
    const previousMonth = month - 1 || 12;

    const previousMonthString = previousMonth.toString();
    const currentMonthString = month.toString();

    const usersRef = db.collection("users");
    const pendingRef = db
      .collection("trades")
      .doc("lends")
      .collection("pending");

    const usersSnapshot = await usersRef.get();
    const pendingSnapshot = await pendingRef.get();

    const batch = db.batch();
    const updatePromises = [];

    // Settle monthly challenge credits
    usersSnapshot.forEach((doc) => {
      if (doc.exists) {
        // const userDocId = doc.id;
        // console.log(userDocId);
        const monthlyRef = doc.ref.collection("monthly");
        const previousMonthDocRef = monthlyRef.doc(previousMonthString);
        const monthlyDocRef = monthlyRef.doc(currentMonthString);

        updatePromises.push(
          previousMonthDocRef.get().then(async (prevMonthDoc) => {
            if (prevMonthDoc.exists && prevMonthDoc.data().challenge.date > 0) {
              // Increment remainingBudget by 10
              batch.update(previousMonthDocRef, {
                remainingBudget: FieldValue.increment(10),
                offsetTotal: FieldValue.increment(10),
                offsets: FieldValue.arrayUnion({
                  category: "challenge",
                  value: 10,
                }),
              });
            }

            // set default fields for the current month
            batch.set(monthlyDocRef, {
              remainingBudget: 0,
              emissionTotal: 0,
              offsetTotal: 0,
              emissions: [],
              offsets: [],
              challenge: {
                date: 0,
                where: "",
                who: "",
                learn: "",
              },
            });
          }),
        );
      }
    });

    // Settle monthly loans
    pendingSnapshot.forEach((doc) => {
      if (doc.exists) {
        // console.log(doc.id);
        const pendingDocRef = doc.ref;
        const { lenderId, amount } = doc.data();

        // Update lender doc and delete pending doc
        const lenderDocRef = db.collection("users").doc(lenderId);
        lenderDocRef.get().then((snapshot) => {
          if (snapshot.exists) {
            batch.update(lenderDocRef, {
              "today.remainingBudget": FieldValue.increment(Number(amount)),
              "tickets.lends": FieldValue.arrayRemove(doc.id),
            });
          }
        });

        batch.delete(pendingDocRef);
      }
    });

    await Promise.all(updatePromises);

    await batch.commit();
    console.log("Monthly tasks completed successfully");
  } catch (error) {
    console.error("Error in executing monthly tasks:", error);
  }
});

exports.dailyDataTransferHttp = onRequest(async (req, res) => {
  // get all user documents in user collection
  const db = getFirestore();
  const usersCollectionRef = db.collection("users");
  const usersSnapshot = await usersCollectionRef.get();

  // forEach user -> get user's "today" data and move to monthly collection for current month
  usersSnapshot.forEach(async (doc) => {
    const userData = doc.data();
    const userDocRef = doc.ref;
    const todayData = userData.today;

    const today = new Date();
    const month = today.getMonth() + 1;
    const monthString = month.toString();

    const monthlyDocRef = userDocRef.collection("monthly").doc(monthString);
    const monthlySnapshot = await monthlyDocRef.get();

    if (monthlySnapshot.exists) {
      const monthlyData = monthlySnapshot.data();
      // add todayData to monthlyData
      const nextData = {
        emissionTotal: monthlyData.emissionTotal + todayData.emissionTotal,
        emissions: [...monthlyData.emissions, ...todayData.emissions],
        offsetTotal: monthlyData.offsetTotal + todayData.offsetTotal,
        offsets: [...monthlyData.offsets, ...todayData.offsets],
        remainingBudget:
          monthlyData.remainingBudget + todayData.remainingBudget,
      };

      await monthlyDocRef.set(nextData, { merge: true });

      // reset user's today
      await userDocRef.update({
        "today.remainingBudget": DAILY_BUDGET,
        "today.emissionTotal": 0,
        "today.offsetTotal": 0,
        "today.emissions": [],
        "today.offsets": [],
      });
    }
  });
  res.status(200).send("Data transfer complete!");
});
