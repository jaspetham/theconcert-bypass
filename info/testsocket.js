import WebSocket from "ws";


// checkout_ws_listener.js
// Node.js script to listen to the WebSocket and capture cart_id + redirect URL
const jwt = "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIyNDQ1NDMsImRhdGEiOnsicm9sZSI6InVzZXIiLCJncm91cCI6MX0sImlhdCI6MTc0NjAyNDYzNiwiZXhwIjoxNzQ4NzE0NjM2fQ.RbU2MBwjpisEV1dLG5G3B0mHr8Zki_anRmDyuSFgPiWSlNnjw_4WO_igRlSk7pVv"; // <-- Your actual JWT here
const productId = '4105'; // replace with your actual product_id
const userId = '2244543'; // replace with your uid

const ws = new WebSocket('wss://3tk6l4uhgrhtfij7r3kxljlnky.appsync-realtime-api.ap-southeast-1.amazonaws.com/graphql', {
  headers: {
    'host': '3tk6l4uhgrhtfij7r3kxljlnky.appsync-realtime-api.ap-southeast-1.amazonaws.com',
    'Sec-WebSocket-Protocol': 'graphql-ws'
  }
});

const connectionInitPayload = {
  type: 'connection_init',
  payload: {
    Authorization: jwt
  }
};

const subscriptionId = `${productId}-${userId}-${crypto.randomUUID()}`;

const subscribePayload = {
  id: subscriptionId,
  type: 'start',
  payload: {
    variables: {},
    extensions: {},
    operationName: 'onUserCountChanged',
    query: `subscription onUserCountChanged {
      onUserCountChanged {
        productId
        count
      }
    }`
  }
};

ws.on('open', () => {
  console.log('WebSocket connection opened. Sending init...');
  ws.send(JSON.stringify(connectionInitPayload));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);

  if (msg.type === 'connection_ack') {
    console.log('Connection acknowledged. Sending subscription...');
    ws.send(JSON.stringify(subscribePayload));
  } else if (msg.type === 'data') {
    const payload = msg.payload?.data?.onUserCountChanged;
    if (payload) {
      console.log('User count update:', payload);
    }
  } else if (msg.type === 'error') {
    console.error('WebSocket error:', msg);
  }
});

ws.on('close', () => {
  console.log('WebSocket closed.');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});
