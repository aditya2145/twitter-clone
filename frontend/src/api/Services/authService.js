export const signupService = async (formData) => {
    const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
}

export const loginService = async (formData) => {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
}

export const logoutService = async () => {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
}