import axios from "axios";

export const Logout: preact.FunctionComponent = () => {
  const request = async () => {
    const req = await axios.post("/api/auth/logout");
    if (req.status == 200) {
      window.location.href = "/";
    }
  };

  return (
    <>
      <button
        type="submit"
        className="group mt-4 relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => request()}
      >
        Log out
      </button>
    </>
  );
};
