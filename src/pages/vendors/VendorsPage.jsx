import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Utensils, Camera, Bed, Eye, Pencil, Trash2 } from "lucide-react";
import { getAllCaterers, deleteCaterer } from "../../services/catererApi";
import {
  deletePhotographer,
  getPhotographers,
} from "../../services/photographerApi";
import { getAllRooms, deleteRoom } from "../../services/roomApi";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const VendorsPage = () => {
  const navigate = useNavigate();
  const [caterers, setCaterers] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("photographers");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [caterersData, photographersData, roomsData] = await Promise.all([
          getAllCaterers(),
          getPhotographers(),
          getAllRooms(),
        ]);

        setCaterers(caterersData);
        setPhotographers(photographersData);
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;
    const { type, id } = deleteItem;
    try {
      if (type === "photographer") {
        await deletePhotographer(id);
        setPhotographers(photographers.filter((p) => p._id !== id));
      } else if (type === "caterer") {
        await deleteCaterer(id);
        setCaterers(caterers.filter((c) => c._id !== id));
      } else if (type === "room") {
        await deleteRoom(id);
        setRooms(rooms.filter((r) => r._id !== id));
      }

      setIsDeleteModalOpen(false);
      setDeleteItem(null);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Failed to delete ${type}. Please try again.`);
    }
  };

  const openDeleteModal = (type, id) => {
    setDeleteItem({ type, id });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteItem(null);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleImageLoad = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id, type) => {
    setImageLoading((prev) => ({ ...prev, [id]: false }));
    return type === "photographer"
      ? "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
      : type === "caterer"
      ? "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
      : "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen font-inter">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">
        Vendor Management
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            icon: Camera,
            title: "Photographers",
            count: photographers.length,
            link: "/vendors/photographers/new",
          },
          {
            icon: Utensils,
            title: "Caterers",
            count: caterers.length,
            link: "/vendors/caterers/new",
          },

          {
            icon: Bed,
            title: "Rooms",
            count: rooms.length,
            link: "/vendors/rooms/new",
          },
        ].map((item, index) => (
          <Card
            key={index}
            className="border-none shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-indigo-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <item.icon className="h-8 w-8 text-indigo-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-3xl font-bold text-indigo-600 mb-2">
                {item.count}
              </p>
              <p className="text-sm font-medium text-gray-500 mb-4">
                Active {item.title.toLowerCase()}
              </p>
              <Link to={item.link}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-indigo-500 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 font-semibold rounded-full py-2.5 px-4 transition-colors duration-200"
                >
                  Add {item.title.slice(0, -1)}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-end space-x-3 mb-8">
        {["photographers", "caterers", "rooms"].map((section) => (
          <Button
            key={section}
            variant={activeSection === section ? "default" : "outline"}
            onClick={() => setActiveSection(section)}
            className={`px-6 py-2.5 rounded-full font-semibold text-base ${
              activeSection === section
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "border-indigo-500 text-indigo-700 hover:bg-indigo-100"
            } transition-all duration-200`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Button>
        ))}
      </div>

      {/* Section Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeSection === "photographers" &&
          photographers.map((photographer) => (
            <Card
              key={photographer._id}
              className="border-none shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative w-full h-48">
                  {imageLoading[photographer._id] !== false && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={photographer.photographyTypes[0]?.sampleWork[0] || ""}
                    alt={photographer.photographerName}
                    className={`w-full h-48 object-cover border-b border-gray-200 ${
                      imageLoading[photographer._id] !== false
                        ? "opacity-0"
                        : "opacity-100"
                    } transition-opacity duration-300`}
                    onLoad={() => handleImageLoad(photographer._id)}
                    onError={(e) => {
                      e.target.src = handleImageError(
                        photographer._id,
                        "photographer"
                      );
                    }}
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-semibold text-gray-900 truncate">
                    {photographer.photographerName}
                  </h4>
                  <p className="text-base font-medium text-gray-600 mt-1">
                    Mandap: {photographer.mandapId[0].mandapName || "N/A"}
                  </p>
                  <p className="text-base font-medium text-gray-600 mt-1 truncate">
                    Types:{" "}
                    {photographer.photographyTypes
                      ?.map((pt) => pt.phtype)
                      .join(", ") || "N/A"}
                  </p>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => openModal(photographer)}
                      className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <Link
                      to={`/vendors/photographers/edit/${photographer._id}`}
                    >
                      <button
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    </Link>
                    <button
                      onClick={() =>
                        openDeleteModal("photographer", photographer._id)
                      }
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

        {activeSection === "caterers" &&
          caterers.map((caterer) => (
            <Card
              key={caterer._id}
              className="border-none shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative w-full h-48">
                  {imageLoading[caterer._id] !== false && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={caterer.menuCategory?.[0]?.categoryImage || ""}
                    alt={caterer.catererName}
                    className={`w-full h-48 object-cover border-b border-gray-200 ${
                      imageLoading[caterer._id] !== false
                        ? "opacity-0"
                        : "opacity-100"
                    } transition-opacity duration-300`}
                    onLoad={() => handleImageLoad(caterer._id)}
                    onError={(e) => {
                      e.target.src = handleImageError(caterer._id, "caterer");
                    }}
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-semibold text-gray-900 truncate">
                    {caterer.catererName}
                  </h4>
                  <p className="text-base font-medium text-gray-600 mt-1">
                    Mandap:{" "}
                    {Array.isArray(caterer.mandapId)
                      ? caterer.mandapId[0]?.mandapName || "N/A"
                      : caterer.mandapId?.mandapName || "N/A"}
                  </p>
                  <p className="text-base font-medium text-gray-600 mt-1">
                    Food Type: {caterer.foodType?.join(", ") || "N/A"}
                  </p>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => openModal(caterer)}
                      className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <Link to={`/vendors/caterers/edit/${caterer._id}`}>
                      <button
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => openDeleteModal("caterer", caterer._id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

        {activeSection === "rooms" &&
          rooms.map((room) => (
            <Card
              key={room._id}
              className="border-none shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative w-full h-48">
                  {imageLoading[room._id] !== false && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={
                      room.AcRoom?.roomImages[0] ||
                      room.NonAcRoom?.roomImages[0] ||
                      ""
                    }
                    alt="Room"
                    className={`w-full h-48 object-cover border-b border-gray-200 ${
                      imageLoading[room._id] !== false
                        ? "opacity-0"
                        : "opacity-100"
                    } transition-opacity duration-300`}
                    onLoad={() => handleImageLoad(room._id)}
                    onError={(e) => {
                      e.target.src = handleImageError(room._id, "room");
                    }}
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-semibold text-gray-900">Room</h4>
                  <p className="text-base font-medium text-gray-600 mt-1">
                    Mandap: {room.mandapId?.mandapName || "N/A"}
                  </p>
                  <p className="text-base font-medium text-gray-600 mt-1 truncate">
                    {room.AcRoom ? `AC: ${room.AcRoom.noOfRooms}` : "No AC"}
                    {room.NonAcRoom && `, Non-AC: ${room.NonAcRoom.noOfRooms}`}
                  </p>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => openModal(room)}
                      className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <Link to={`/vendors/rooms/edit/${room._id}`}>
                      <button
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => openDeleteModal("room", room._id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-inter">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {activeSection === "photographers" &&
                  selectedItem.photographerName}
                {activeSection === "caterers" && selectedItem.catererName}
                {activeSection === "rooms" && "Room Details"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold transition-colors"
              >
                &times;
              </button>
            </div>
            {activeSection === "photographers" && (
              <div className="space-y-6">
                <div className="relative w-full h-80 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  {imageLoading[`modal-${selectedItem._id}`] !== false && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={selectedItem.photographyTypes[0]?.sampleWork[0] || ""}
                    alt={selectedItem.photographerName}
                    className={`w-full h-80 object-cover ${
                      imageLoading[`modal-${selectedItem._id}`] !== false
                        ? "opacity-0"
                        : "opacity-100"
                    } transition-opacity duration-300`}
                    onLoad={() => handleImageLoad(`modal-${selectedItem._id}`)}
                    onError={(e) => {
                      e.target.src = handleImageError(
                        `modal-${selectedItem._id}`,
                        "photographer"
                      );
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-gray-700">
                    <strong>Mandap:</strong>{" "}
                    {selectedItem.mandapId?.mandapName || "N/A"}
                  </p>
                  <div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      <strong>Photography Types:</strong>
                    </p>
                    <ul className="space-y-4">
                      {selectedItem.photographyTypes?.map((pt, index) => (
                        <li key={index} className="text-gray-600">
                          <span className="font-medium">
                            {pt.phtype || "N/A"}
                          </span>
                          {pt.pricePerEvent != null ? (
                            <span>
                              {" "}
                              - ₹{Number(pt.pricePerEvent).toLocaleString()}
                            </span>
                          ) : (
                            <span> - Price: N/A</span>
                          )}
                          {pt.sampleWork?.length > 0 && (
                            <div className="mt-3">
                              <p className="text-base font-medium text-gray-700">
                                Sample Work:
                              </p>
                              <div className="grid grid-cols-3 gap-3 mt-2">
                                {pt.sampleWork.map((img, i) => (
                                  <div
                                    key={i}
                                    className="relative w-full h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                                  >
                                    {imageLoading[
                                      `${selectedItem._id}-sample-${i}`
                                    ] !== false && (
                                      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                                    )}
                                    <img
                                      src={img}
                                      alt={`Sample ${i + 1}`}
                                      className={`w-full h-28 object-cover ${
                                        imageLoading[
                                          `${selectedItem._id}-sample-${i}`
                                        ] !== false
                                          ? "opacity-0"
                                          : "opacity-100"
                                      } transition-opacity duration-300`}
                                      onLoad={() =>
                                        handleImageLoad(
                                          `${selectedItem._id}-sample-${i}`
                                        )
                                      }
                                      onError={(e) => {
                                        e.target.src = handleImageError(
                                          `${selectedItem._id}-sample-${i}`,
                                          "photographer"
                                        );
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {selectedItem.printOption?.length > 0 && (
                    <div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        <strong>Print Options:</strong>
                      </p>
                      <ul className="space-y-2">
                        {selectedItem.printOption.map((po, index) => (
                          <li key={index} className="text-gray-600">
                            {po.printType || "N/A"} - {po.printDesc || "N/A"}{" "}
                            {po.printPrice != null
                              ? `(₹${Number(po.printPrice).toLocaleString()})`
                              : "(Price: N/A)"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeSection === "caterers" && (
              <div className="space-y-6">
                <div className="relative w-full h-80 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  {imageLoading[`modal-${selectedItem._id}`] !== false && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={selectedItem.menuCategory?.[0]?.categoryImage || ""}
                    alt={selectedItem.catererName}
                    className={`w-full h-80 object-cover ${
                      imageLoading[`modal-${selectedItem._id}`] !== false
                        ? "opacity-0"
                        : "opacity-100"
                    } transition-opacity duration-300`}
                    onLoad={() => handleImageLoad(`modal-${selectedItem._id}`)}
                    onError={(e) => {
                      e.target.src = handleImageError(
                        `modal-${selectedItem._id}`,
                        "caterer"
                      );
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-gray-700">
                    <strong>Mandap:</strong>{" "}
                    {Array.isArray(selectedItem.mandapId)
                      ? selectedItem.mandapId[0]?.mandapName || "N/A"
                      : selectedItem.mandapId?.mandapName || "N/A"}
                  </p>
                  <p className="text-lg font-semibold text-gray-700">
                    <strong>Food Type:</strong>{" "}
                    {selectedItem.foodType?.join(", ") || "N/A"}
                  </p>
                  <div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      <strong>Menu Categories:</strong>
                    </p>
                    <ul className="space-y-4">
                      {selectedItem.menuCategory?.map((category, index) => (
                        <li key={index} className="text-gray-600">
                          <span className="font-medium">
                            {category.category || "N/A"}
                          </span>
                          {category.pricePerPlate != null ? (
                            <span>
                              {" "}
                              - ₹
                              {Number(category.pricePerPlate).toLocaleString()}
                              /plate
                            </span>
                          ) : (
                            <span> - Price: N/A</span>
                          )}
                          {category.menuItems?.length > 0 && (
                            <div className="mt-3">
                              <p className="text-base font-medium text-gray-700">
                                Menu Items:
                              </p>
                              <ul className="list-disc pl-5 mt-2 text-gray-600">
                                {category.menuItems.map((item, i) => (
                                  <li key={i} className="mt-1">
                                    {item.itemName || "N/A"}{" "}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">
                    <strong>Customizable:</strong>{" "}
                    {selectedItem.isCustomizable ? "Yes" : "No"}
                  </p>
                  {selectedItem.isCustomizable &&
                    selectedItem.customizableItems?.length > 0 && (
                      <div>
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                          <strong>Customizable Items:</strong>
                        </p>
                        <ul className="list-disc pl-5 mt-2 text-gray-600">
                          {selectedItem.customizableItems.map((item, index) => (
                            <li key={index} className="mt-1">
                              {item.itemName || "N/A"}{" "}
                              {item.itemPrice != null
                                ? `(₹${Number(
                                    item.itemPrice
                                  ).toLocaleString()})`
                                : "(Price: N/A)"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  <p className="text-lg font-semibold text-gray-700">
                    <strong>Tasting Session:</strong>{" "}
                    {selectedItem.hasTastingSession
                      ? "Available"
                      : "Not Available"}
                  </p>
                </div>
              </div>
            )}
            {activeSection === "rooms" && (
              <div className="space-y-6">
                <div className="relative w-full h-80 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  {imageLoading[`modal-${selectedItem._id}`] !== false && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={
                      selectedItem.AcRoom?.roomImages[0] ||
                      selectedItem.NonAcRoom?.roomImages[0] ||
                      ""
                    }
                    alt="Room"
                    className={`w-full h-80 object-cover ${
                      imageLoading[`modal-${selectedItem._id}`] !== false
                        ? "opacity-0"
                        : "opacity-100"
                    } transition-opacity duration-300`}
                    onLoad={() => handleImageLoad(`modal-${selectedItem._id}`)}
                    onError={(e) => {
                      e.target.src = handleImageError(
                        `modal-${selectedItem._id}`,
                        "room"
                      );
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-gray-700">
                    <strong>Mandap:</strong>{" "}
                    {selectedItem.mandapId?.mandapName || "N/A"}
                  </p>
                  {selectedItem.AcRoom && (
                    <div className="mt-6">
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        <strong>AC Rooms:</strong>
                      </p>
                      <p className="text-base font-medium text-gray-600">
                        Number of Rooms:{" "}
                        {selectedItem.AcRoom.noOfRooms || "N/A"}
                      </p>
                      <p className="text-base font-medium text-gray-600">
                        Price per Night:{" "}
                        {selectedItem.AcRoom.pricePerNight != null
                          ? `₹${Number(
                              selectedItem.AcRoom.pricePerNight
                            ).toLocaleString()}`
                          : "N/A"}
                      </p>
                      <p className="text-base font-medium text-gray-600">
                        Amenities:{" "}
                        {selectedItem.AcRoom.amenities?.join(", ") || "N/A"}
                      </p>
                      {selectedItem.AcRoom.roomImages?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-base font-medium text-gray-700">
                            Images:
                          </p>
                          <div className="grid grid-cols-3 gap-3 mt-2">
                            {selectedItem.AcRoom.roomImages.map((img, i) => (
                              <div
                                key={i}
                                className="relative w-full h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                              >
                                {imageLoading[`${selectedItem._id}-ac-${i}`] !==
                                  false && (
                                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                                )}
                                <img
                                  src={img}
                                  alt={`AC Room ${i + 1}`}
                                  className={`w-full h-28 object-cover ${
                                    imageLoading[
                                      `${selectedItem._id}-ac-${i}`
                                    ] !== false
                                      ? "opacity-0"
                                      : "opacity-100"
                                  } transition-opacity duration-300`}
                                  onLoad={() =>
                                    handleImageLoad(
                                      `${selectedItem._id}-ac-${i}`
                                    )
                                  }
                                  onError={(e) => {
                                    e.target.src = handleImageError(
                                      `${selectedItem._id}-ac-${i}`,
                                      "room"
                                    );
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedItem.NonAcRoom && (
                    <div className="mt-6">
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        <strong>Non-AC Rooms:</strong>
                      </p>
                      <p className="text-base font-medium text-gray-600">
                        Number of Rooms:{" "}
                        {selectedItem.NonAcRoom.noOfRooms || "N/A"}
                      </p>
                      <p className="text-base font-medium text-gray-600">
                        Price per Night:{" "}
                        {selectedItem.NonAcRoom.pricePerNight != null
                          ? `₹${Number(
                              selectedItem.NonAcRoom.pricePerNight
                            ).toLocaleString()}`
                          : "N/A"}
                      </p>
                      <p className="text-base font-medium text-gray-600">
                        Amenities:{" "}
                        {selectedItem.NonAcRoom.amenities?.join(", ") || "N/A"}
                      </p>
                      {selectedItem.NonAcRoom.roomImages?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-base font-medium text-gray-700">
                            Images:
                          </p>
                          <div className="grid grid-cols-3 gap-3 mt-2">
                            {selectedItem.NonAcRoom.roomImages.map((img, i) => (
                              <div
                                key={i}
                                className="relative w-full h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                              >
                                {imageLoading[
                                  `${selectedItem._id}-nonac-${i}`
                                ] !== false && (
                                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                                )}
                                <img
                                  src={img}
                                  alt={`Non-AC Room ${i + 1}`}
                                  className={`w-full h-28 object-cover ${
                                    imageLoading[
                                      `${selectedItem._id}-nonac-${i}`
                                    ] !== false
                                      ? "opacity-0"
                                      : "opacity-100"
                                  } transition-opacity duration-300`}
                                  onLoad={() =>
                                    handleImageLoad(
                                      `${selectedItem._id}-nonac-${i}`
                                    )
                                  }
                                  onError={(e) => {
                                    e.target.src = handleImageError(
                                      `${selectedItem._id}-nonac-${i}`,
                                      "room"
                                    );
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={closeModal}
                variant="outline"
                className="px-6 py-2.5 border-indigo-500 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 font-semibold rounded-full transition-colors duration-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deleteItem && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-inter">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Confirm Deletion
              </h2>
              <button
                onClick={closeDeleteModal}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold transition-colors"
              >
                &times;
              </button>
            </div>
            <p className="text-base font-medium text-gray-600 mb-6">
              Are you sure you want to delete this {deleteItem.type}?
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={closeDeleteModal}
                variant="outline"
                className="px-6 py-2.5 border-indigo-500 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 font-semibold rounded-full transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 font-semibold rounded-full transition-colors duration-200"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
