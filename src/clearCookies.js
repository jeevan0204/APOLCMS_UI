import Cookies from 'js-cookie';

export function clearCookies() {
  const cookies = Object.keys(Cookies.get());
  // console.log("cookies::",cookies);

  cookies.forEach((cookie) => {
    Cookies.remove(cookie);
  });
};

