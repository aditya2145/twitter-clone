export const getPosts = async (POST_ENDPOINT) => {
  const res = await fetch(POST_ENDPOINT);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
};

export const createPost = async ({ text, img }) => {
  const formData = new FormData();
  if(text) {
    formData.append('text', text);
  }
  if(img) {
    formData.append('file', img);
  }

  const res = await fetch('/api/post/create', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};

export const deletePost = async ({post}) => {
  const res = await fetch(`/api/post/${post._id}`, {
    method: "DELETE",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
};

export const commentOnPost = async ({ post, comment }) => {
  const res = await fetch(`/api/post/comment/${post._id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: comment }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
};

export const likeUnlikePost = async ({ post }) => {
  const res = await fetch(`/api/post/like/${post._id}`, {
    method: "POST",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
};