export async function getPrompts() {
  const defaultPrompts = [
    "Write a summary of this article.",
    "Explain this code in simple terms.",
    "Generate 5 creative blog post ideas.",
    "Translate this text to Hindi.",
    "What are the key takeaways from this?"
  ];
  return new Promise((resolve) =>
    chrome.storage.local.get(["prompts"], (result) => {
      resolve(result.prompts && result.prompts.length > 0 ? result.prompts : defaultPrompts);
    })
  );
}

export function savePrompts(prompts) {
  chrome.storage.local.set({ prompts });
}