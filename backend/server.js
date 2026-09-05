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

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    console.log("Connected to Supabase client.");
  } catch (err) {
    console.warn("Could not connect to Supabase, running with in-memory store:", err.message);
  }
} else {
  console.log("No Supabase credentials found in .env; running in live in-memory mode.");
}

const inMemoryPosts = [
  {
    platform: "Bluesky",
    author: "user.bsky.social",
    text: "AI models advancing rapidly in 2026! Real-time stream telemetry active.",
    likes: 14,
    reposts: 5,
    replies: 2,
    created_at: new Date().toISOString(),
    sentiment: "Positive",
    emotion: "Excited",
    topic: "AI",
    language: "English",
    misinformation_score: 5,
    bot_score: 8
  }
];


// ==========================================
// BASIC NEXORA AI INTELLIGENCE
// ==========================================

function analyzePost(text) {
  const lower = text.toLowerCase();

  // Sentiment
  let sentiment = "Neutral";

  const positiveWords = [
    "good", "great", "love", "amazing", "excellent",
    "happy", "success", "win", "beautiful", "best"
  ];

  const negativeWords = [
    "bad", "hate", "terrible", "worst", "angry",
    "sad", "fail", "danger", "problem", "scam"
  ];

  const positiveCount = positiveWords.filter(word =>
    lower.includes(word)
  ).length;

  const negativeCount = negativeWords.filter(word =>
    lower.includes(word)
  ).length;

  if (positiveCount > negativeCount) {
    sentiment = "Positive";
  } else if (negativeCount > positiveCount) {
    sentiment = "Negative";
  }

  // Emotion
  let emotion = "Neutral";

  if (
    lower.includes("love") ||
    lower.includes("happy") ||
    lower.includes("excited") ||
    lower.includes("amazing")
  ) {
    emotion = "Joy";
  } else if (
    lower.includes("angry") ||
    lower.includes("hate") ||
    lower.includes("furious")
  ) {
    emotion = "Anger";
  } else if (
    lower.includes("fear") ||
    lower.includes("danger") ||
    lower.includes("scared")
  ) {
    emotion = "Fear";
  } else if (
    lower.includes("sad") ||
    lower.includes("loss")
  ) {
    emotion = "Sadness";
  }

  // Topic
  let topic = "General";

  if (
    lower.includes("ai") ||
    lower.includes("artificial intelligence") ||
    lower.includes("machine learning")
  ) {
    topic = "AI & Technology";
  } else if (
    lower.includes("crypto") ||
    lower.includes("bitcoin") ||
    lower.includes("ethereum")
  ) {
    topic = "Crypto & Finance";
  } else if (
    lower.includes("sports") ||
    lower.includes("football") ||
    lower.includes("cricket")
  ) {
    topic = "Sports";
  } else if (
    lower.includes("politics") ||
    lower.includes("government") ||
    lower.includes("election")
  ) {
    topic = "Politics";
  } else if (
    lower.includes("climate") ||
    lower.includes("environment") ||
    lower.includes("weather")
  ) {
    topic = "Environment";
  }

  // Basic misinformation risk
  let misinformation_score = 10;

  if (
    lower.includes("breaking") ||
    lower.includes("shocking") ||
    lower.includes("secret") ||
    lower.includes("100%") ||
    lower.includes("you won't believe")
  ) {
    misinformation_score = 70;
  }

  // Basic bot-risk indicator
  let bot_score = 10;

  if (
    text.length < 20 ||
    lower.includes("buy now") ||
    lower.includes("click here") ||
    lower.includes("follow me")
  ) {
    bot_score = 45;
  }

  // Simple language detection
  let language = "English";

  if (/[\u3040-\u30ff]/.test(text)) {
    language = "Japanese";
  } else if (/[\u4e00-\u9fff]/.test(text)) {
    language = "Chinese";
  } else if (/[\uac00-\ud7af]/.test(text)) {
    language = "Korean";
  }

  return {
    sentiment,
    emotion,
    topic,
    language,
    misinformation_score,
    bot_score
  };
}
// ==========================================
// DASHBOARD API
// ==========================================

app.get("/api/dashboard", async (req, res) => {
  try {
    let posts = null;
    if (supabase) {
      const { data, error } = await supabase
        .from("social_posts")
        .select("*");
      if (!error && data) {
        posts = data;
      }
    }

    if (!posts) {
      posts = inMemoryPosts;
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
// LIVE INTELLIGENCE API
// ==========================================

app.get("/api/live", async (req, res) => {
  try {
    let posts = null;
    if (supabase) {
      const { data, error } = await supabase
        .from("social_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (!error && data) {
        posts = data;
      }
    }

    if (!posts) {
      posts = inMemoryPosts.slice(0, 20);
    }

    res.json(posts);

  } catch (error) {
    console.error("Live intelligence error:", error);

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

      const text = record.text || "";

const intelligence = analyzePost(text);

const row = {
  platform: "Bluesky",
  author: event.did || "unknown",
  text: text,
  likes: 0,
  reposts: 0,
  replies: 0,
  created_at:
    record.createdAt || new Date().toISOString(),

  sentiment: intelligence.sentiment,
  emotion: intelligence.emotion,
  topic: intelligence.topic,
  language: intelligence.language,
  misinformation_score: intelligence.misinformation_score,
  bot_score: intelligence.bot_score
};

      inMemoryPosts.unshift(row);
      if (inMemoryPosts.length > 500) {
        inMemoryPosts.pop();
      }

      if (supabase) {
        const { error } = await supabase
          .from("social_posts")
          .insert([row]);

        if (error) {
          console.error("Supabase insert error:", error);
          return;
        }
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