require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const WebSocket = require("ws");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(
  express.static(path.join(__dirname, "../Prototype-main/public"))
);

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ==========================================
// DASHBOARD API
// ==========================================

app.get("/api/dashboard", async (req, res) => {
  try {
    const { data: posts, error } = await supabase
      .from("social_posts")
      .select("*");

    if (error) {
      throw error;
    }

    const totalPosts = posts.length;

    const activeUsers = new Set(
      posts.map(post => post.author).filter(Boolean)
    ).size;

    const engagement = posts.reduce(
      (total, post) =>
        total +
        (post.likes || 0) +
        (post.reposts || 0) +
        (post.replies || 0),
      0
    );

    res.json({
      totalPosts,
      activeUsers,
      engagement
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      error: error.message
    });
  }
});

// ==========================================
// BLUESKY REAL-TIME STREAM
// ==========================================

function startBlueskyStream() {

  const jetstreamURL =
    "wss://jetstream2.us-west.bsky.network/subscribe" +
    "?wantedCollections=app.bsky.feed.post";

  console.log("Connecting to Bluesky Jetstream...");

  const ws = new WebSocket(jetstreamURL);

  ws.on("open", () => {
    console.log("Connected to Bluesky real-time stream");
  });

  ws.on("message", async (message) => {

    try {

      const event = JSON.parse(message.toString());

      // We only want newly created posts
      if (
        event.kind !== "commit" ||
        event.commit?.operation !== "create" ||
        event.commit?.collection !== "app.bsky.feed.post"
      ) {
        return;
      }

      const record = event.commit.record;

      if (!record) {
        return;
      }

      const row = {
        platform: "Bluesky",
        author: event.did || "unknown",
        text: record.text || "",
        likes: 0,
        reposts: 0,
        replies: 0,
        created_at:
          record.createdAt || new Date().toISOString()
      };

      const { error } = await supabase
        .from("social_posts")
        .insert([row]);

      if (error) {
        console.error("Supabase insert error:", error);
        return;
      }

      console.log(
        `New Bluesky post saved: ${row.text.substring(0, 60)}`
      );

    } catch (error) {

      console.error(
        "Bluesky stream error:",
        error.message
      );

    }

  });

  ws.on("error", (error) => {
    console.error(
      "Bluesky WebSocket error:",
      error.message
    );
  });

  ws.on("close", () => {

    console.log(
      "Bluesky stream disconnected. Reconnecting in 5 seconds..."
    );

    setTimeout(startBlueskyStream, 5000);

  });
}

// ==========================================
// STREAM STATUS
// ==========================================

app.get("/api/sync", (req, res) => {

  res.json({
    success: true,
    message: "NEXORA is connected to the Bluesky real-time stream."
  });

});

// ==========================================
// START SERVER
// ==========================================

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `NEXORA Backend running on http://localhost:${PORT}`
  );

  startBlueskyStream();

});