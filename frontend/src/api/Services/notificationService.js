export const getNotifications = async () => {
    const res = await fetch('/api/notifications');
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
};

export const deleteNotifications = async () => {
    const res = await fetch('/api/notifications', {
        method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
};