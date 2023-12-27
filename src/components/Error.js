import { useRouteError } from "react-router-dom";

const Error = () => {
  const err = useRouteError();
  return (
    <div className="text-center h-screen flex flex-col gap-4 justify-center items-center text-4xl">
      <h1 className="italic">Stop playin around with the routes xD</h1>
      <p>
        Error{" "}
        {err
          ? `${err.status}: ${err.statusText}`
          : "Please check your resources!"}
      </p>
    </div>
  );
};

export default Error;