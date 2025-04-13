const WebSocket = require("ws");

const ws = new WebSocket(
  "wss://theconcert-production-db3.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db3"
);

let hasSentQuery = false;
let messageBuffer = ""; // Buffer to accumulate raw data
let parsedMessages = []; // Array to store all parsed messages

ws.on("open", () => {
  console.log("✅ WebSocket connection opened.");
});

ws.on("message", (raw) => {
  const rawString = raw.toString("utf8");
  messageBuffer += rawString;

  let braceCount = 0;
  let startIndex = 0;

  for (let i = 0; i < messageBuffer.length; i++) {
    if (messageBuffer[i] === "{") {
      braceCount++;
    } else if (messageBuffer[i] === "}") {
      braceCount--;
      if (braceCount === 0) {
        const potentialJson = messageBuffer.slice(startIndex, i + 1);
        try {
          const msg = JSON.parse(potentialJson);
          // Push the parsed message into the array
          parsedMessages.push(msg);

          // Handle Firebase messages
          if (msg.t === "h") {
            // Heartbeat response
            ws.send(JSON.stringify({ t: "h" }));
          } else if (msg.t === "c" && !hasSentQuery) {
            // Firebase connection ready
            console.log("🔗 Firebase connection established.");
            ws.send(
              JSON.stringify({
                t: "d",
                d: { r: 3, a: "q", b: { p: "/seat/4073/37963", h: "" } },
              })
            );
            hasSentQuery = true;
          } else if (msg.t === "d" && msg.d?.r === 3) {
            ws.close(); // Close WebSocket to stop further messages
            break; // Exit the parsing loop
          }

          // Move startIndex to after this JSON object
          startIndex = i + 1;
        } catch (e) {
          console.error("❌ JSON parsing error for chunk:", e.message);
          console.error("Faulty chunk:", potentialJson);
          // Keep buffer for incomplete JSON
          break;
        }
      }
    }
  }

  // Update buffer: keep unprocessed data
  if (startIndex > 0) {
    messageBuffer = messageBuffer.slice(startIndex);
  }

  // Handle non-JSON messages (e.g., "3")
  if (messageBuffer.trim() === "3") {
    messageBuffer = "";
  }
});

ws.on("close", () => {
  console.log("🔌 WebSocket closed.");
  parsedMessages.forEach((msg) => {
    if (
      msg.t === "d" &&
      Object.prototype.hasOwnProperty.call(msg, "d") &&
      Object.prototype.hasOwnProperty.call(msg.d, "b") &&
      msg.d.b?.p === "seat/4073/37963"
    ) {
      const rawSeatData = msg.d.b.d;

      // Extract seat objects and separate "open_at"
      const seatDataArray = [];
      let rootOpenAt = null;

      Object.entries(rawSeatData).forEach(([key, value]) => {
        if (key === "open_at") {
          // Preserve the root-level "open_at"
          rootOpenAt = value;
        } else if (value.id && value.status) {
          // Assume this is a seat object if it has "id" and "status"
          seatDataArray.push(value);
        }
      });

      // Construct the final object
      const seatDataObj = {
        seatData: seatDataArray.filter((value) => value.status === "available"),
        ...(rootOpenAt !== null && { open_at: rootOpenAt }), // Add "open_at" only if it exists
      };

      console.log(
        "Transformed seat data:",
        JSON.stringify(seatDataObj, null, 2)
      );
    }
  });
});

ws.on("error", (err) => {
  console.error("❌ WebSocket error:", err);
});
