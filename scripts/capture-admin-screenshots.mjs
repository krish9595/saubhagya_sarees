import fs from "fs";

async function run() {
  const versionRes = await fetch("http://localhost:9222/json/new?http://localhost:3000/admin/products", { method: "PUT" });
  const page = await versionRes.json();
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      const { resolve, reject } = callbacks.get(data.id);
      callbacks.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise((res) => (ws.onopen = res));

  // Set cookie for auth
  await send("Network.enable");
  await send("Network.setCookie", {
    name: "saubhagya_admin_token",
    value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbXdhem1sd3kwMDFhdW52MW9rdWs2enFuIiwiZW1haWwiOiJhZG1pbkBzYXViaGFneWFzYXJlZXMuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwibmFtZSI6IlNhdWJoYWd5YSBTdHVkaW8gT3duZXIiLCJpYXQiOjE3OTQzMzc0MjgsImV4cCI6MTc5NDk0MjIyOH0.Bx7iMUvLR-TPXfZqTG8mXxjjOlibMFmCU-C0kszBPH8",
    domain: "localhost",
    path: "/",
    httpOnly: true,
  });

  // Set viewport
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Navigate to products
  await send("Page.navigate", { url: "http://localhost:3000/admin/products" });
  await new Promise((r) => setTimeout(r, 2000));

  // Click "Add New Creation" button or first edit button
  await send("Runtime.evaluate", {
    expression: `
      const btn = document.querySelector('button svg.lucide-plus')?.closest('button') || document.querySelector('button svg.lucide-edit-3')?.closest('button');
      if (btn) btn.click();
    `,
  });

  await new Promise((r) => setTimeout(r, 1000));

  // Capture screenshot of products with modal open
  const screenshotRes = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("/Users/krishgupta/.gemini/antigravity/brain/a5967f6c-9a06-467c-9903-1681af68ec45/admin_products_modal.png", Buffer.from(screenshotRes.data, "base64"));
  console.log("Captured admin_products_modal.png");

  // Navigate to staff
  await send("Page.navigate", { url: "http://localhost:3000/admin/staff" });
  await new Promise((r) => setTimeout(r, 2000));
  const staffShot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("/Users/krishgupta/.gemini/antigravity/brain/a5967f6c-9a06-467c-9903-1681af68ec45/admin_staff_verified.png", Buffer.from(staffShot.data, "base64"));
  console.log("Captured admin_staff_verified.png");

  // Navigate to inventory
  await send("Page.navigate", { url: "http://localhost:3000/admin/inventory" });
  await new Promise((r) => setTimeout(r, 2000));
  const invShot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("/Users/krishgupta/.gemini/antigravity/brain/a5967f6c-9a06-467c-9903-1681af68ec45/admin_inventory_verified.png", Buffer.from(invShot.data, "base64"));
  console.log("Captured admin_inventory_verified.png");

  ws.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
