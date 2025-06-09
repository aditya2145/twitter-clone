export const getUserProfile = async ({ username }) => {
    const res = await fetch(`/api/users/profile/${username}`);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
};

export const getAuthUser = async () => {
    const res = await fetch("/api/auth/me");

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
    }

    const data = await res.json();
    return data;
};

export const updateUser = async ({ profileImg, coverImg, fullName, bio, currentPassword, newPassword }) => {
    const formData = new FormData();
    if (profileImg) {
        formData.append("profileImg", profileImg); 
    }
    if (coverImg) {
        formData.append("coverImg", coverImg); 
    }

    formData.append("fullName", fullName);
    formData.append("bio", bio);
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    const res = await fetch('/api/users/update', {
        method: "PUT",
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
};

export const followUnfollowUser = async ({ username }) => {
    const res = await fetch(`/api/users/follow/${username}`, {
        method: "POST",
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
};

export const getSuggestedUsers = async () => {
    const res = await fetch('/api/users/suggested');
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
};