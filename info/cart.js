const url = "https://api.theconcert.com/carts";
const token =
  "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIyNDQ1NDMsImRhdGEiOnsicm9sZSI6InVzZXIiLCJncm91cCI6MX0sImlhdCI6MTc0NDM0MTA2MSwiZXhwIjoxNzQ3MDMxMDYxfQ.PONArirdQFH51WzNICmTnTP_lR7SKW66aVhq5wTJo2wJpCKyGk4M_Pc1jPzThTE8"; // Your full bearer token
const requestBody = {
  cart_id: 2244543,
  products: [
    {
      id: 4073,
      variant_id: 37963,
      quantity: 1,
      price: 1200,
      gate_open: "2025-04-26 06:00:00",
      zone: "A1",
      symbol: "฿",
      currency_code: "thb",
      seats: [{ key: "id_1163262", id: 1163262, name: "D3" }],
    },
  ],
  currency_code: "thb",
};

// 1. Using Fetch API
fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Note: "Bearer" prefix required
    Origin: "https://www.theconcert.com",
    Referer: "https://www.theconcert.com/",
    "X-Requested-With": "XMLHttpRequest",
    "X-Currency": "thb",
    Priority: "u=1, i",
    Accept: "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  },
  body: JSON.stringify(requestBody),
})
  .then(async (response) => {
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status} - ${errorBody}`);
    }
    return response.json();
  })

  .then((data) => console.log("Success:", data))
  .catch((error) => console.error("Error:", error));
