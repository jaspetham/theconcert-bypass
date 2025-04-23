import type {
  AvailableSeatDataObj,
  WebSocketMessage,
  Seat,
} from "~~/types/concertSeatTypes";

const DATABASE_URLS = [
  "wss://theconcert-production-db0.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db0",
  "wss://theconcert-production-db1.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db1",
  "wss://theconcert-production-db2.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db2",
  "wss://theconcert-production-db3.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db3",
  "wss://theconcert-production-db4.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db4",
  "wss://theconcert-production-db5.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db5",
  "wss://theconcert-production-db6.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db6",
  "wss://theconcert-production-db7.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db7",
  "wss://theconcert-production-db8.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db8",
  "wss://theconcert-production-db9.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db9",
];

export async function fetchSeatData(
  productId: number,
  variantId: number
): Promise<AvailableSeatDataObj> {
  const seatPath = `seat/${productId}/${variantId}`;
  const promises = DATABASE_URLS.map(
    (url, index) =>
      new Promise<AvailableSeatDataObj | null>((resolve, reject) => {
        const ws = new WebSocket(url);
        let hasSentQuery = false;
        let messageBuffer = "";
        let parsedMessages: WebSocketMessage[] = [];

        ws.onopen = () => {
          console.log(`✅ WebSocket ${index} opened for ${url}`);
        };

        ws.onmessage = (event: MessageEvent) => {
          const rawString = event.data.toString();
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
                  const msg: WebSocketMessage = JSON.parse(potentialJson);
                  parsedMessages.push(msg);

                  if (msg.t === "h") {
                    ws.send(JSON.stringify({ t: "h" }));
                  } else if (msg.t === "c" && !hasSentQuery) {
                    console.log(
                      `🔗 Firebase connection established for ${url}`
                    );
                    ws.send(
                      JSON.stringify({
                        t: "d",
                        d: { r: 3, a: "q", b: { p: seatPath, h: "" } },
                      })
                    );
                    hasSentQuery = true;
                  } else if (msg.t === "d" && msg.d?.r === 3) {
                    ws.close();
                    break;
                  }

                  startIndex = i + 1;
                } catch (e) {
                  console.error(
                    `❌ JSON parsing error in ${url}:`,
                    e,
                    `Message: ${potentialJson}`
                  );
                  // Reset buffer to avoid accumulating garbage
                  messageBuffer = "";
                  startIndex = 0;
                  break;
                }
              }
            }else if (
              braceCount === 0 &&
              !/[{\s]/.test(messageBuffer[i] ?? '')
            ) {
              // Handle non-JSON keep-alives (e.g., "0", "3")
              console.debug(`Ignored non-JSON message in ${url}:`, messageBuffer);
              messageBuffer = "";
              startIndex = 0;
              return;
            }
          }

          if (startIndex > 0) {
            messageBuffer = messageBuffer.slice(startIndex);
          }

          if (messageBuffer.trim() === "3") {
            messageBuffer = "";
          }
        };

        ws.onclose = () => {
          console.log(`🔌 WebSocket ${index} closed for ${url}`);
          const relevantMessage = parsedMessages.find(
            (msg) => msg.t === "d" && msg.d?.b?.p === seatPath
          );
          if (relevantMessage) {
            const rawSeatData = relevantMessage.d!.b!.d;
            const seatDataArray: any[] = [];
            let rootOpenAt: string | number | null = null;
            Object.entries(rawSeatData ?? {}).forEach(
              ([key, value]: [string, any]) => {
                if (key === "open_at") {
                  rootOpenAt = value;
                } else if (value.id && value.status) {
                  seatDataArray.push(value);
                }
              }
            );

            const availableSeatDataObj: AvailableSeatDataObj = {
              seatData: seatDataArray.filter(
                (seat) => seat.status === "available"
              ),
              ...(rootOpenAt !== null && { open_at: rootOpenAt }),
            };

            resolve(availableSeatDataObj);
          } else {
            resolve(null);
          }
        };

        ws.onerror = (err) => {
          console.error(`❌ WebSocket ${index} error for ${url}:`, err);
          resolve(null); // Continue with other connections
        };
      })
  );

  const results = await Promise.all(promises);
  const seatData = results.find((result) => result !== null);

  if (!seatData) {
    throw new Error("No seat data found in any database");
  }

  return seatData;
}
