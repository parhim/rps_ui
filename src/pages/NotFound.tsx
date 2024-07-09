export const NotFound = () => {
  return <NotFoundLayout />;
};

export const NotFoundLayout = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <p className="text-2xl">404</p>
      <p className="text-xl">Not Found</p>
    </div>
  );
};
