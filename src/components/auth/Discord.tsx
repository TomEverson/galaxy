export const Discord: preact.FunctionComponent = () => {
  return (
    <>
      <form action="/api/auth/oauth/discord" method="post">
        <button className="mt-4 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Discord
        </button>
      </form>
    </>
  );
};
