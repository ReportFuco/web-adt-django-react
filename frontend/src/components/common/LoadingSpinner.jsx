import Logo from "../../assets/adt-logo.png";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="relative flex items-center justify-center">
        {/* Spinner aro grande girando */}
        <div className="absolute border-8 border-t-8 border-white border-t-transparent rounded-full w-24 h-24 animate-spin"></div>
        <img
          src={Logo}
          alt="Loading"
          className="w-16 h-16 object-contain z-10"
        />
      </div>
    </div>
  );
}
