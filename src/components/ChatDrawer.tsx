import { useEffect } from "react";

type ChatDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div aria-label="Chat drawer" className="fixed inset-0 z-50">
      {/* overlay click closes */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l p-4 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Operations Assistant</h3>
          <button
            className="px-2 py-1 rounded-md border hover:bg-muted"
            onClick={onClose}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        <div id="chat-scroll" className="flex-1 overflow-y-auto rounded-lg border p-3 space-y-2">
          <div className="text-sm text-muted-foreground">
            Ask me about boiler operations, parameters, or system status.
          </div>
        </div>

        <form
          className="mt-3 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const message = String(fd.get("message") || "");
            (e.currentTarget as HTMLFormElement).reset();
            if (!message) return;

            // call GROQ API
            const r = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message }),
            });
            const response = await r.json();
            console.log("Chat response:", response);
          }}
        >
          <input
            name="message"
            placeholder="Type a message…"
            className="flex-1 rounded-md border px-3 py-2"
          />
          <button className="rounded-md border px-3 py-2">Send</button>
        </form>
      </div>
    </div>
  );
}