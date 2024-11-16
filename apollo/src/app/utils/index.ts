export const checkIfImageExists = (url: string) => {
  return false;
  return fetch(url, { method: 'HEAD' }).then(
    res => {
      console.log(res);
      return res.ok;
    }
  ).catch(e => {
    console.error(`load image ${url} error:`, e);
    return false;
  })
}

export const getImageExists = async (url: string, defaultUrl?: string) => {
  return url;
  const isExists = await checkIfImageExists(url);
  if (isExists) {
    return url;
  } else {
    return defaultUrl || 'assets/images/noimage.png';
  }
}