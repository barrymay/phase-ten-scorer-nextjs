export const isAuth0Registered: () => boolean = () => {
  return !!process.env.AUTH0_CLIENT;
};
