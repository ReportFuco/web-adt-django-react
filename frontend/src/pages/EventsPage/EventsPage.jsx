import Header from "../../components/layout/Header";
import SpotifyPlaylist from "../../components/common/SpotifyPlaylist";
import Footer from "../../components/layout/Footer";
import technoImage from "../../assets/techno 7.jpg";
import EventSection from "../EventsPage/EventSection";

function EventsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col">
        <section className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 flex-grow">
          <aside
            className="bg-cover bg-center bg-no-repeat h-24 md:h-auto md:col-span-1"
            style={{ backgroundImage: `url(${technoImage})` }}
          ></aside>
          {/* aca quiero colocar el h1 */}
          <section className="md:col-span-4 flex flex-col gap-4 items-center">
            <h1 className="text-3xl font-extrabold text-center my-4">últimos Eventos</h1>

            <article className="p-0.5">
              <EventSection
                destacadas={true}
                limit={10}
                gridCols="md:grid-cols-2"
                cardHeight="h-90"
              />
            </article>
            <article className="p-0.5">
              <EventSection
                destacadas={false}
                limit={10}
                gridCols="md:grid-cols-4"
                cardHeight="h-80"
              />
            </article>
          </section>

          <aside
            className="bg-cover bg-center bg-no-repeat h-30 my-2 md:h-auto md:col-span-1"
            style={{ backgroundImage: `url(${technoImage})` }}
          ></aside>
        </section>

        <div className="w-full mt-10">
          <SpotifyPlaylist />
        </div>
        <Footer />
      </main>
    </>
  );
}

export default EventsPage;
