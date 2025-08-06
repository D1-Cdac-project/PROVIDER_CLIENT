import React, { useState, useEffect } from "react";
import MandapCard from "../../components/mandap/MandapCard";
import {
  getProviderMandaps,
  updateMandap,
  deleteMandap,
} from "../../services/mandapApi";
import { getReviewsByMandapId } from "../../services/reviewApi";

const MandapsListPage = () => {
  const [mandaps, setMandaps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchMandaps = async () => {
      try {
        setLoading(true);
        const response = await getProviderMandaps();
        const activeMandaps = response.filter((mandap) => mandap.isActive);
        const mappedMandaps = await Promise.all(
          activeMandaps.map(async (mandap) => {
            const reviews = await getReviewsByMandapId(mandap._id);

            const averageRating =
              reviews.length > 0
                ? reviews.reduce((sum, review) => sum + review.rating, 0) /
                  reviews.length
                : 0;

            return {
              id: mandap._id,
              mandapName: mandap.mandapName,
              description:
                mandap.mandapDesc ||
                mandap.description ||
                "No description available",
              address: mandap.address,
              guestCapacity: mandap.guestCapacity,
              price: mandap.venuePricing,
              images:
                mandap.venueImages.length > 0
                  ? mandap.venueImages[0]
                  : "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg",
              averageRating: averageRating,
              noOfReviews: reviews.length,
            };
          })
        );
        setMandaps(mappedMandaps);
        // Store ratings for potential future use
        const ratingsMap = mappedMandaps.reduce(
          (acc, mandap) => ({
            ...acc,
            [mandap.id]: mandap.averageRating,
          }),
          {}
        );
        setRatings(ratingsMap);
      } catch (error) {
        console.error("Error fetching mandaps or reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMandaps();
  }, []);

  const handleDelete = async (mandapId) => {
    try {
      await deleteMandap(mandapId);
      setMandaps((prevMandaps) =>
        prevMandaps.filter((mandap) => mandap.id !== mandapId)
      );
    } catch (error) {
      console.error("Error deleting mandap:", error);
    }
  };

  const handleEdit = async (mandapId, mandapData, venueImages) => {
    try {
      const updatedMandap = await updateMandap(
        mandapId,
        mandapData,
        venueImages
      );
      setMandaps((prevMandaps) =>
        prevMandaps.map((mandap) =>
          mandap.id === mandapId ? { ...mandap, ...updatedMandap } : mandap
        )
      );
    } catch (error) {
      console.error("Error updating mandap:", error);
    }
  };

  const filteredMandaps = mandaps.filter((mandap) => {
    const matchesSearch =
      mandap.mandapName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mandap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mandap.address.city.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "high-capacity" && mandap.guestCapacity >= 400)
      return matchesSearch;
    if (
      filter === "medium-capacity" &&
      mandap.guestCapacity < 400 &&
      mandap.guestCapacity >= 200
    )
      return matchesSearch;
    if (filter === "low-capacity" && mandap.guestCapacity < 200)
      return matchesSearch;

    return false;
  });

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Mandaps</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Venues</option>
            <option value="high-capacity">High Capacity (400+)</option>
            <option value="medium-capacity">Medium Capacity (200-399)</option>
            <option value="low-capacity">Low Capacity (&lt;200)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMandaps.map((mandap) => (
          <MandapCard
            key={mandap.id}
            mandap={mandap}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {filteredMandaps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No venues found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default MandapsListPage;
