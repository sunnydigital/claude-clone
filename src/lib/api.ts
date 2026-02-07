export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: string) => void;
}

export async function streamChat(
  messages: { role: string; content: string }[],
  model: string,
  apiKey: string,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, model, apiKey }),
    signal,
  });

  if (!response.ok) {
    const err = await response.json();
    callbacks.onError(err.error || "Request failed");
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    callbacks.onError("No response stream");
    return;
  }

  const decoder = new TextDecoder();
  let fullText = "";
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.type === "content_block_delta") {
              const text = parsed.delta?.text || "";
              fullText += text;
              callbacks.onToken(text);
            } else if (parsed.type === "message_stop") {
              // Stream complete
            } else if (parsed.type === "error") {
              callbacks.onError(parsed.error?.message || "Stream error");
              return;
            }
          } catch {
            // Skip non-JSON lines
          }
        }
      }
    }
  } catch (e) {
    if ((e as Error).name === "AbortError") return;
    callbacks.onError((e as Error).message);
    return;
  }

  callbacks.onComplete(fullText);
}
