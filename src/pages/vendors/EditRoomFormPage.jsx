import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { getRoomById, updateRoom } from "../../services/roomApi";
import { getProviderMandaps } from "../../services/mandapApi";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";

const EditRoomFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [mandaps, setMandaps] = useState([]);
  const [formData, setFormData] = useState({
    mandapId: "",
    AcRoom: {
      noOfRooms: "",
      pricePerNight: "",
      amenities: [],
      roomImages: [],
    },
    NonAcRoom: {
      noOfRooms: "",
      pricePerNight: "",
      amenities: [],
      roomImages: [],
    },
    isActive: true,
  });
  const [acRoomFiles, setAcRoomFiles] = useState([]);
  const [nonAcRoomFiles, setNonAcRoomFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const acAmenities = [
    "WiFi",
    "TV",
    "AirConditioning",
    "MiniBar",
    "RoomService",
    "Balcony",
    "Desk",
    "Safe",
  ];
  const nonAcAmenities = [
    "WiFi",
    "TV",
    "Fan",
    "RoomService",
    "Balcony",
    "Desk",
    "Safe",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mandapsData, roomData] = await Promise.all([
          getProviderMandaps(),
          getRoomById(id),
        ]);
        setMandaps(mandapsData);
        setFormData({
          mandapId: roomData.mandapId || "",
          AcRoom: {
            noOfRooms: roomData.AcRoom?.noOfRooms || "",
            pricePerNight: roomData.AcRoom?.pricePerNight || "",
            amenities: roomData.AcRoom?.amenities || [],
            roomImages: roomData.AcRoom?.roomImages || [],
          },
          NonAcRoom: {
            noOfRooms: roomData.NonAcRoom?.noOfRooms || "",
            pricePerNight: roomData.NonAcRoom?.pricePerNight || "",
            amenities: roomData.NonAcRoom?.amenities || [],
            roomImages: roomData.NonAcRoom?.roomImages || [],
          },
          isActive: roomData.isActive ?? true,
        });
        setAcRoomFiles(roomData.AcRoom?.roomImages.map(() => null) || []);
        setNonAcRoomFiles(roomData.NonAcRoom?.roomImages.map(() => null) || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load room data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAmenityToggle = (roomType, amenity) => {
    setFormData((prev) => ({
      ...prev,
      [roomType]: {
        ...prev[roomType],
        amenities: prev[roomType].amenities.includes(amenity)
          ? prev[roomType].amenities.filter((a) => a !== amenity)
          : [...prev[roomType].amenities, amenity],
      },
    }));
  };

  const handleImageUpload = (roomType, files) => {
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(
        (file) => URL.createObjectURL(file) // For preview only
      );
      setFormData((prev) => ({
        ...prev,
        [roomType]: {
          ...prev[roomType],
          roomImages: [...prev[roomType].roomImages, ...newImages], // For UI preview
        },
      }));
      const fileObjects = Array.from(files);
      if (roomType === "AcRoom") {
        setAcRoomFiles((prev) => [...prev, ...fileObjects]);
      } else {
        setNonAcRoomFiles((prev) => [...prev, ...fileObjects]);
      }
    }
  };

  const removeImage = (roomType, index) => {
    setFormData((prev) => ({
      ...prev,
      [roomType]: {
        ...prev[roomType],
        roomImages: prev[roomType].roomImages.filter((_, i) => i !== index),
      },
    }));
    if (roomType === "AcRoom") {
      setAcRoomFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNonAcRoomFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRoom(
        id,
        {
          ...formData,
          AcRoom: {
            ...formData.AcRoom,
            roomImages: formData.AcRoom.roomImages,
          },
          NonAcRoom: {
            ...formData.NonAcRoom,
            roomImages: formData.NonAcRoom.roomImages,
          },
        },
        acRoomFiles.filter((file) => file),
        nonAcRoomFiles.filter((file) => file)
      );
      toast.success("Room updated successfully!");
      navigate("/vendors");
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen font-inter">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 p-4 sm:p-6 max-w-4xl font-inter">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/vendors")}
          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full"
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4 tracking-tight">
          Edit Room
        </h1>
      </div>

      <Card className="border-none shadow-lg rounded-2xl bg-white">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Mandap <span className="text-red-500">*</span>
                </label>
                <Select
                  options={[
                    { value: "", label: "Select mandap" },
                    ...mandaps.map((mandap) => ({
                      value: mandap._id,
                      label: mandap.mandapName || "Unknown",
                    })),
                  ]}
                  value={formData.mandapId}
                  onChange={(value) => handleInputChange("mandapId", value)}
                  fullWidth
                  className="text-base font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  AC Rooms
                </h3>
                <Input
                  label="Number of AC Rooms"
                  type="number"
                  value={formData.AcRoom.noOfRooms}
                  onChange={(e) =>
                    handleInputChange("AcRoom.noOfRooms", e.target.value)
                  }
                  placeholder="Enter number of rooms"
                  fullWidth
                  className="text-base font-medium"
                />
                <Input
                  label="Price per Night (₹)"
                  type="number"
                  value={formData.AcRoom.pricePerNight}
                  onChange={(e) =>
                    handleInputChange("AcRoom.pricePerNight", e.target.value)
                  }
                  placeholder="₹ 0"
                  fullWidth
                  className="mt-4 text-base font-medium"
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {acAmenities.map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.AcRoom.amenities.includes(amenity)}
                          onChange={() =>
                            handleAmenityToggle("AcRoom", amenity)
                          }
                          className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-600">
                      Upload AC room images (Multiple allowed)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="ac-room-images"
                      onChange={(e) =>
                        handleImageUpload("AcRoom", e.target.files)
                      }
                    />
                    <label
                      htmlFor="ac-room-images"
                      className="mt-2 inline-block cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
                    >
                      Choose Images
                    </label>
                  </div>
                  {formData.AcRoom.roomImages?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                      {formData.AcRoom.roomImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`AC Room ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage("AcRoom", index)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Non-AC Rooms
                </h3>
                <Input
                  label="Number of Non-AC Rooms"
                  type="number"
                  value={formData.NonAcRoom.noOfRooms}
                  onChange={(e) =>
                    handleInputChange("NonAcRoom.noOfRooms", e.target.value)
                  }
                  placeholder="Enter number of rooms"
                  fullWidth
                  className="text-base font-medium"
                />
                <Input
                  label="Price per Night (₹)"
                  type="number"
                  value={formData.NonAcRoom.pricePerNight}
                  onChange={(e) =>
                    handleInputChange("NonAcRoom.pricePerNight", e.target.value)
                  }
                  placeholder="₹ 0"
                  fullWidth
                  className="mt-4 text-base font-medium"
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {nonAcAmenities.map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.NonAcRoom.amenities.includes(
                            amenity
                          )}
                          onChange={() =>
                            handleAmenityToggle("NonAcRoom", amenity)
                          }
                          className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-600">
                      Upload Non-AC room images (Multiple allowed)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="non-ac-room-images"
                      onChange={(e) =>
                        handleImageUpload("NonAcRoom", e.target.files)
                      }
                    />
                    <label
                      htmlFor="non-ac-room-images"
                      className="mt-2 inline-block cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
                    >
                      Choose Images
                    </label>
                  </div>
                  {formData.NonAcRoom.roomImages?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                      {formData.NonAcRoom.roomImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Non-AC Room ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage("NonAcRoom", index)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/vendors")}
                className="px-6 py-2.5 border-indigo-500 text-indigo-700 hover:bg-indigo-100 rounded-full text-base font-semibold"
                fullWidth={window.innerWidth < 640}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                icon={<Save className="h-4 w-4" />}
                className="px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full text-base font-semibold"
                fullWidth={window.innerWidth < 640}
              >
                Update Room
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditRoomFormPage;
