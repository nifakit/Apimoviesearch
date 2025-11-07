import React, { useState, useEffect } from "react";
import Modal from "./Modal";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);


  useEffect(() => {
    async function fetchMovies() {
      const query = debouncedSearch.trim();
      if (!query) {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const res = await fetch(
        `https://www.omdbapi.com/?apikey=285a71f6&s=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      setMovies(data.Search || []);
      setLoading(false);
    }

    fetchMovies();
  }, [debouncedSearch]);

  return (

    <><Modal isOpen={open} onClose={() => setOpen(false)}>
      <div className="min-w-[300px] max-w-md">
  {movieDetails ? (
    <div className="bg-[#181818] p-6 rounded-lg shadow-lg max-w-md mx-auto space-y-3 text-white">
      <h2 className="text-2xl font-bold">{movieDetails.Title}</h2>

      <p className="text-sm text-gray-300">
        <span className="font-semibold">Year:</span> {movieDetails.Year}
      </p>

      <div>
        <p className="font-semibold mb-1">About:</p>
        <p className="text-gray-400 text-sm leading-snug">
          {movieDetails.Plot}
        </p>
      </div>

      <p className="text-sm">
        <span className="font-semibold">IMDb:</span> ⭐ {movieDetails.imdbRating}/10
      </p>
    </div>
  ) : (
    <p className="text-white text-center">Loading...</p>
  )}
  </div>
</Modal>

    <div className="min-h-screen p-8 bg-[#0b0b0b]">

        <div className="max-w-5xl m-auto p-4 bg-[#181818] text-white rounded-xl shadow-lg text-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Movie Search</h1>
          <input
            type="text"
            placeholder="Type something..."
            className="p-3 bg-[#282828] rounded-lg w-96 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>


        <div className="max-w-5xl m-auto mt-8 p-8 bg-[#181818] text-white rounded-xl shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
              : movies.length === 0
                ? (
                  <p className="text-white text-xl col-span-full mt-4 text-center">
                    No items found
                  </p>
                )
                : movies.map((p) => (
                  <div
                    key={p.imdbID}
                    className="bg-[#363636] rounded-2xl shadow p-4 flex flex-col justify-between"
                  >
                    <img
                      src={p.Poster}
                      alt={p.Title}
                      className="w-full h-48 object-cover rounded-xl mb-3" />
                    <h2 className="text-lg text-center text-white font-semibold">{p.Title}</h2>
                    <h2 className="text-sm text-center text-gray-300 mb-4">{p.Year}</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl"
                      onClick={async () => { 
                        setSelectedMovie(p); 
                        setOpen(true);
                        const res = await fetch(
                          `https://www.omdbapi.com/?apikey=285a71f6&i=${p.imdbID}&plot=full`);
                          const data = await res.json();
                          setMovieDetails(data);
                        }}>
                      View Details
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </div></>
  );
}


function SkeletonCard() {
  return (
    <div className="bg-gray-200 rounded-2xl p-4 animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded-xl mb-3"></div>
      <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-10 bg-gray-300 rounded-xl"></div>
    </div>
  );
}


function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

