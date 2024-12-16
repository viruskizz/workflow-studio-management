export const getDefaultAvatar = () => {
  const rand = Math.floor(Math.random() * 6);
  const imageUrl = `assets/images/avatars/default-avatar-${rand}.jpg`
  return imageUrl;
}