import SpotifyPlaylist from "../../components/common/SpotifyPlaylist";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import technoImage from "../../assets/techno 7.jpg";
import NewsSection from "../NewsPage/NewsSection";
import EventSections from "../EventsPage/EventSection";
import StoreSection from "../store/StoreSection";

function MainPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col">
        <section className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 flex-grow">
          <aside
            className="bg-cover bg-center bg-no-repeat h-24 md:h-auto md:col-span-1"
            style={{ backgroundImage: `url(${technoImage})` }}
          ></aside>
          <section className="md:col-span-4 flex flex-col gap-4">
            <article className="p-0.5">
              <NewsSection
                destacadas={true}
                limit={2}
                gridCols="md:grid-cols-2"
                cardHeight="h-90"
              />
            </article>
            <article>
              <EventSections
                destacadas={true}
                limit={2}
                gridCols="md:grid-cols-2"
                cardHeight="h-90"
              />
            </article>

            {/* Acá va la tienda  */}
            <article>
              <StoreSection
                destacadas={true}
                limit={4}
                gridCols="md:grid-cols-4"
                cardHeight="h-80"
              />
            </article>

            <article className="p-0.5">
              <NewsSection
                destacadas={false}
                limit={8}
                gridCols="md:grid-cols-4"
                cardHeight="h-80"
              />
            </article>

            <article className="p-0.5">
              <EventSections
                destacadas={false}
                limit={8}
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

export default MainPage;
