const getOrCreateUserId = () => {
  let id = localStorage.getItem('movify_user_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('movify_user_id', id);
  }
  return id;
};

export const USER_ID = getOrCreateUserId();
