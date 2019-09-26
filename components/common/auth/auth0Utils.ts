export const isAuth0Registered: (req: any) => boolean = req => {
  if (!req) {
    const { enableAuth0 } = (window as any).__NEXT_DATA__.props;
    return enableAuth0;
  }

  return !!process.env.AUTH0_CLIENT;
};
