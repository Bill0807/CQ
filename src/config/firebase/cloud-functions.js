const dailyDataTransferHttp =
  "http://127.0.0.1:5001/carbon-app-6efd9/us-central1/dailyDataTransferHttp";

const monthlySettlementHttp =
  "http://127.0.0.1:5001/carbon-app-6efd9/us-central1/monthlySettlementHttp";

const loanSettlementHttp =
  "http://127.0.0.1:5001/carbon-app-6efd9/us-central1/loanSettlementHttp";

async function triggerLoanSettlement() {
  try {
    const res = await fetch(loanSettlementHttp, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const text = await res.text();
      console.log(text);
    }
  } catch (error) {
    console.error("Failed to trigger loan settlement: ", error);
  }
}

async function triggerMonthlySettlement() {
  try {
    const response = await fetch(monthlySettlementHttp, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // if (response.ok) {
    //   const data = await response.json();
    //   console.log(data);
    // }
  } catch (error) {
    console.error("Error triggering function", error);
  }
}

async function triggerDataTransfer() {
  try {
    const response = await fetch(dailyDataTransferHttp, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    }
  } catch (error) {
    console.error("Error triggering function", error);
  }
}

export { triggerDataTransfer, triggerMonthlySettlement, triggerLoanSettlement };
