import Maps from "./Maps";

function EventCard({ evento }) {
  return (
    <div className="max-w-6xl px-1 py-2">
      <div className="grid md:grid-cols-4 gap-1">
        <div
          key={evento.id}
          className="relative group overflow-hidden shadow-lg cursor-pointer m-0.5"
          onClick={() => {
            navigate(`/evento/${evento.id}`);
          }}
        >
          <img
            src={evento.imagen}
            alt={evento.nombre}
            className="w-full h-100 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full text-white bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
            <h3 className="text-sm font-semibold leading-tight">
              {evento.nombre}
            </h3>
            <p className="text-xs opacity-80">
              {evento.descripcion.slice(0, 100)}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
