import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import {
  getPhotographerById,
  updatePhotographer,
} from "../../services/photographerApi";
import { getProviderMandaps } from "../../services/mandapApi";
import { Card, CardContent } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

const EditPhotographerFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [mandaps, setMandaps] = useState([]);
  const [formData, setFormData] = useState({
    mandapId: "",
    photographerName: "",
    photographyTypes: [
      {
        phtype: "",
        pricePerEvent: "",
        sampleWork: [],
      },
    ],
    isActive: true,
  });
  const [sampleWorkFiles, setSampleWorkFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const photographyTypeOptions = [
    "Candid",
    "Traditional",
    "Pre-wedding",
    "Post-wedding",
    "Drone Photography",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mandapsData, photographerData] = await Promise.all([
          getProviderMandaps(),
          getPhotographerById(id),
        ]);
        setMandaps(mandapsData);
        const photographyTypes =
          photographerData.photographyTypes?.length > 0
            ? photographerData.photographyTypes
            : [{ phtype: "", pricePerEvent: "", sampleWork: [] }];
        setFormData({
          mandapId: photographerData.mandapId || "",
          photographerName: photographerData.photographerName || "",
          photographyTypes,
          isActive: photographerData.isActive ?? true,
        });
        setSampleWorkFiles(
          photographyTypes.map((type) => type.sampleWork.map(() => null))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load photographer data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addPhotographyType = () => {
    setFormData((prev) => ({
      ...prev,
      photographyTypes: [
        ...prev.photographyTypes,
        {
          phtype: "",
          pricePerEvent: "",
          sampleWork: [],
        },
      ],
    }));
    setSampleWorkFiles((prev) => [...prev, []]);
  };

  const removePhotographyType = (index) => {
    setFormData((prev) => ({
      ...prev,
      photographyTypes: prev.photographyTypes.filter((_, i) => i !== index),
    }));
    setSampleWorkFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePhotographyType = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      photographyTypes: prev.photographyTypes.map((type, i) =>
        i === index ? { ...type, [field]: value } : type
      ),
    }));
  };

  const handleSampleWorkUpload = (typeIndex, files) => {
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      const updatedTypes = [...formData.photographyTypes];
      updatedTypes[typeIndex].sampleWork = [
        ...updatedTypes[typeIndex].sampleWork,
        ...newImages,
      ];
      setFormData((prev) => ({ ...prev, photographyTypes: updatedTypes }));

      const fileObjects = Array.from(files);
      setSampleWorkFiles((prev) => {
        const newFiles = [...prev];
        newFiles[typeIndex] = [...(newFiles[typeIndex] || []), ...fileObjects];
        return newFiles;
      });
    }
  };

  const removeSampleWork = (typeIndex, imageIndex) => {
    setFormData((prev) => {
      const updatedTypes = [...prev.photographyTypes];
      updatedTypes[typeIndex].sampleWork = updatedTypes[
        typeIndex
      ].sampleWork.filter((_, i) => i !== imageIndex);
      return { ...prev, photographyTypes: updatedTypes };
    });

    setSampleWorkFiles((prev) => {
      const newFiles = [...prev];
      newFiles[typeIndex] = (newFiles[typeIndex] || []).filter(
        (_, i) => i !== imageIndex
      );
      return newFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sampleWork = formData.photographyTypes
        .flatMap((type, index) => sampleWorkFiles[index] || [])
        .filter((file) => file);
      await updatePhotographer(id, formData, sampleWork);
      toast.success("Photographer updated successfully!");
      navigate("/vendors");
    } catch (error) {
      console.error("Error updating photographer:", error);
      toast.error("Failed to update photographer.");
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
          Edit Photographer
        </h1>
      </div>

      <Card className="border-none shadow-lg rounded-2xl bg-white">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Photographer Name"
                value={formData.photographerName}
                onChange={(e) =>
                  handleInputChange("photographerName", e.target.value)
                }
                placeholder="Enter photographer name"
                required
                fullWidth
                className="text-base font-medium"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Mandap <span className="text-red-500">*</span>
                </label>
                <Select
                  options={[
                    { value: "", label: "Select mandap" },
                    ...mandaps.map((mandap) => ({
                      value: mandap._id,
                      label: mandap.mandapName || mandap.name || "Unknown",
                    })),
                  ]}
                  value={formData.mandapId}
                  onChange={(value) => handleInputChange("mandapId", value)}
                  fullWidth
                  className="text-base font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Photography Types
                </h3>
                <Button
                  type="button"
                  onClick={addPhotographyType}
                  icon={<Plus className="h-4 w-4" />}
                  size="sm"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-4 py-2"
                >
                  Add Photography Type
                </Button>
              </div>

              {formData.photographyTypes.map((type, typeIndex) => (
                <div
                  key={typeIndex}
                  className="bg-blue-50 p-4 rounded-lg mb-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold text-gray-900">
                      Photography Type #{typeIndex + 1}
                    </h4>
                    {formData.photographyTypes.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removePhotographyType(typeIndex)}
                        variant="danger"
                        size="sm"
                        className="bg-red-600 text-white hover:bg-red-700 rounded-full px-3 py-1"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <Select
                      label="Photography Type"
                      options={[
                        { value: "", label: "Select type" },
                        ...photographyTypeOptions.map((option) => ({
                          value: option,
                          label: option,
                        })),
                      ]}
                      value={type.phtype}
                      onChange={(value) =>
                        updatePhotographyType(typeIndex, "phtype", value)
                      }
                      fullWidth
                      className="text-base font-medium"
                    />
                    <Input
                      label="Price for this type (₹)"
                      type="number"
                      value={type.pricePerEvent}
                      onChange={(e) =>
                        updatePhotographyType(
                          typeIndex,
                          "pricePerEvent",
                          e.target.value
                        )
                      }
                      placeholder="₹ 0"
                      fullWidth
                      className="text-base font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sample Work
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm font-medium text-gray-600">
                        Upload sample work (Multiple images allowed)
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        id={`sample-work-${typeIndex}`}
                        onChange={(e) =>
                          handleSampleWorkUpload(typeIndex, e.target.files)
                        }
                      />
                      <label
                        htmlFor={`sample-work-${typeIndex}`}
                        className="mt-2 inline-block cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
                      >
                        Choose Images
                      </label>
                    </div>

                    {type.sampleWork?.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {type.sampleWork.map((image, imageIndex) => (
                          <div key={imageIndex} className="relative">
                            <img
                              src={image}
                              alt={`Sample work ${imageIndex + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeSampleWork(typeIndex, imageIndex)
                              }
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
              ))}
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
                Update Photographer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPhotographerFormPage;
