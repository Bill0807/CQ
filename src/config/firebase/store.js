import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { firestore } from "./init";

async function getAllUsers() {
  try {
    const currentMonth = (new Date().getMonth() + 1).toString();
    const usersCollectionRef = collection(firestore, "users");
    const querySnap = await getDocs(usersCollectionRef);

    if (!querySnap.empty) {
      const usersPromises = querySnap.docs.map(async (userDoc) => {
        const monthlyDocRef = doc(
          firestore,
          "users",
          userDoc.id,
          "monthly",
          currentMonth,
        );

        const monthlyDocSnap = await getDoc(monthlyDocRef);
        if (monthlyDocSnap.exists()) {
          return {
            ...userDoc.data(),
            monthly: monthlyDocSnap.data(),
          };
        }
      });

      const users = await Promise.all(usersPromises);
      return users;
    }
  } catch (error) {
    console.error("Failed to get all users", error);
  }
}

async function setMonthlyChallenge({ uid, data }) {
  try {
    const currentMonth = (new Date().getMonth() + 1).toString();
    const monthlyDocRef = doc(firestore, "users", uid, "monthly", currentMonth);

    await updateDoc(monthlyDocRef, {
      challenge: {
        date: data.when,
        learn: data.learn,
        where: data.where,
        who: data.who,
        date_created: serverTimestamp(),
      },
    });

    const monthlyDocSnap = await getDoc(monthlyDocRef);
    return monthlyDocSnap.data();
  } catch (error) {
    console.error("Failed to set monthly challenge", error);
  }
}

async function setUser({ uid, profile }) {
  try {
    const userDocRef = doc(firestore, "users", uid);
    const userDefaultFields = {
      username: profile.username,
      school: profile.school,
      today: {
        remainingBudget: 6.4,
        emissionTotal: 0,
        offsetTotal: 0,
        emissions: [],
        offsets: [],
      },
      tickets: {
        borrow: [],
        lend: [],
      },
    };

    // 'monthly' sub-collection
    const monthlyDefaultFields = {
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
    };

    const today = new Date();
    const currentMonth = (today.getMonth() + 1).toString();

    const monthlyDocRef = doc(userDocRef, "monthly", currentMonth);

    // Batched Writes
    const batch = writeBatch(firestore);
    batch.set(userDocRef, userDefaultFields);
    batch.set(monthlyDocRef, monthlyDefaultFields);

    await batch.commit();

    // After commiting batch, retrieve user document from firestore
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const completeUserData = userDocSnap.data();

      // Retrieve "monthly" sub-collection
      const monthlyDocSnap = await getDoc(monthlyDocRef);
      if (monthlyDocSnap.exists()) {
        completeUserData.monthly = {
          [monthlyDocSnap.id]: monthlyDocSnap.data(),
        };

        return completeUserData;
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getUser(uid) {
  try {
    const userDocRef = doc(firestore, "users", uid);
    const monthlyRef = collection(userDocRef, "monthly");

    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      const monthlySnap = await getDocs(monthlyRef);
      const monthlyData = {};
      monthlySnap.forEach((doc) => {
        const data = doc.data();
        monthlyData[doc.id] = data;
      });

      const completeUserData = {
        ...userData,
        monthly: monthlyData,
      };

      return completeUserData;
    }
  } catch (error) {
    console.error("Error getting user data: ", error);
  }
}

async function deleteUser(uid) {
  try {
    const batch = writeBatch(firestore);
    const monthlyRef = collection(firestore, "users", uid, "monthly");
    const querySnap = await getDocs(monthlyRef);
    querySnap.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    await deleteDoc(doc(firestore, "users", uid));
    return true;
  } catch (error) {
    console.error("Error deleting user in firestore: ", error);
    throw error;
  }
}

async function setOffset({ uid, offset }) {
  try {
    const userDocRef = doc(firestore, "users", uid);

    await updateDoc(userDocRef, {
      "today.offsetTotal": increment(offset.value),
      "today.remainingBudget": increment(offset.value),
      "today.offsets": arrayUnion(offset),
    });

    const updatedUserDoc = await getDoc(userDocRef);
    return updatedUserDoc.data();
  } catch (error) {
    console.error("Failed to set offset: ", error);
  }
}

async function setEmission({ uid, emission }) {
  try {
    const userDocRef = doc(firestore, "users", uid);

    await updateDoc(userDocRef, {
      "today.emissionTotal": increment(emission.value),
      "today.remainingBudget": increment(-emission.value),
      "today.emissions": arrayUnion(emission),
    });

    const updatedUserDoc = await getDoc(userDocRef);
    return updatedUserDoc.data();
  } catch (error) {
    console.error("Failed to set emsision: ", error);
  }
}

async function setBorrowTicket({ amount, uid }) {
  try {
    const pendingRef = collection(firestore, "trades", "borrows", "pending");
    const userDocRef = doc(firestore, "users", uid);
    // new borrow ticket
    const ticketDocRef = doc(pendingRef);

    const batch = writeBatch(firestore);

    batch.set(ticketDocRef, {
      date_created: serverTimestamp(),
      borrowerId: uid,
      amount,
    });
    batch.update(userDocRef, {
      "tickets.borrow": arrayUnion(ticketDocRef.id),
    });

    await batch.commit();

    const updatedUserDoc = await getDoc(userDocRef);
    return updatedUserDoc.data();
  } catch (error) {
    console.error("Failed to set borrow ticket: ", error);
  }
}

async function deleteBorrowTicket({ uid, borrowTicketId }) {
  try {
    const pendingDocRef = doc(
      firestore,
      "trades",
      "borrows",
      "pending",
      borrowTicketId,
    );
    const userDocRef = doc(firestore, "users", uid);

    const batch = writeBatch(firestore);

    // Check if pending document exists
    const pendingDoc = await getDoc(pendingDocRef);
    if (pendingDoc.exists()) {
      batch.delete(pendingDocRef);

      batch.update(userDocRef, {
        "tickets.borrow": arrayRemove(borrowTicketId),
      });

      await batch.commit();

      const updatedUserDoc = await getDoc(userDocRef);
      return updatedUserDoc.data();
    }
  } catch (error) {
    console.error("Failed to delete borrow ticket: ", error);
  }
}

async function getBorrowTickets() {
  try {
    const queryRef = collection(firestore, "trades", "borrows", "pending");
    const querySnap = await getDocs(queryRef);

    const ticketsPromises = querySnap.docs.map(async (doc) => {
      const borrowerUsername = await getUserNameByUid(doc.data().borrowerId);
      return {
        ...doc.data(),
        borrowTicketId: doc.id,
        borrowerUsername,
      };
    });
    const tickets = await Promise.all(ticketsPromises);
    return tickets;
  } catch (error) {
    console.error("Failed to get all borrow tickets: ", error);
  }
}

async function setLendingTicket({ uid, borrowTicketId }) {
  try {
    const borrowDocRef = doc(
      firestore,
      "trades",
      "borrows",
      "pending",
      borrowTicketId,
    );
    const pendingDoc = await getDoc(borrowDocRef);

    if (pendingDoc.exists()) {
      const request = pendingDoc.data();

      // References for lender and borrower
      const lenderDocRef = doc(firestore, "users", uid);
      const borrowerDocRef = doc(firestore, "users", request.borrowerId);

      // Reference for moving ticket to lends collection
      const lendingDocRef = doc(
        firestore,
        "trades",
        "lends",
        "pending",
        borrowTicketId,
      );

      // Prepare data for lending ticket
      const lendingData = {
        ...request,
        lenderId: uid,
        date_lent: serverTimestamp(),
      };

      // Batched writes
      const batch = writeBatch(firestore);

      // Update lender document to give amount
      batch.update(lenderDocRef, {
        "today.remainingBudget": increment(-request.amount),
        "tickets.lend": arrayUnion(borrowTicketId),
      });

      // Update borrower document to receive amount
      batch.update(borrowerDocRef, {
        "today.remainingBudget": increment(request.amount),
      });

      // Move ticket to lends collection for pending settlement
      batch.set(lendingDocRef, lendingData);
      batch.delete(borrowDocRef);

      // Commit the batch
      await batch.commit();

      // Fetch updated lender document
      const updatedLenderDoc = await getDoc(lenderDocRef);
      const updatedLenderData = updatedLenderDoc.data();

      return updatedLenderData;
    }
  } catch (error) {
    console.error("Failed to set lending ticket: ", error);
    throw error;
  }
}

async function getUserNameByUid(uid) {
  try {
    const userDocRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.username;
    }
  } catch (error) {
    console.error("Failed to get username: ", error);
  }
}

export default {
  setUser,
  getUser,
  deleteUser,
  getAllUsers,
  setOffset,
  setEmission,
  setBorrowTicket,
  getBorrowTickets,
  deleteBorrowTicket,
  setLendingTicket,
  setMonthlyChallenge,
};
