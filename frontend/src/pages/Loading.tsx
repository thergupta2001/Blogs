import ReactLoading from "react-loading";
export default function Loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <ReactLoading type={"bars"} color={"black"} height={100} width={100} />
    </div>
  );
}