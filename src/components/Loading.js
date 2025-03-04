function Loading() {
  return (
    <div className="flex-center flex-col h-screen w-full background-light850_dark100">
      <div className="flex-center flex-col gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500" />
        <p className="paragraph-medium text-dark300_light700">Loading...</p>
      </div>
    </div>
  );
}

export default Loading;
