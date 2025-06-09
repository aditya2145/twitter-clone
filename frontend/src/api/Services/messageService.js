export const getAllConversations = async () => {
    const res = await fetch('/api/messages/allconversations');
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
};

export const getConversation = async ({ username }) => {
    const res = await fetch(`/api/messages/conversation/${username}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
};

export const sendMessage = async ({user, text}) => {
    const receiverId = user?._id;
    const res = await fetch('/api/messages/send', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, text })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
}