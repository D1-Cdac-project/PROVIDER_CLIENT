import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { getCatererById, updateCaterer } from "../../services/catererApi";
import { getProviderMandaps } from "../../services/mandapApi";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";

const EditCatererFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [mandaps, setMandaps] = useState([]);
  const [formData, setFormData] = useState({
    mandapId: "",
    catererName: "",
    menuCategory: [
      {
        category: "",
        menuItems: [],
        pricePerPlate: "",
        categoryImage: "",
      },
    ],
    foodType: [],
    isCustomizable: false,
    customizableItems: [],
    hasTastingSession: false,
    isActive: true,
  });
  const [newMenuItem, setNewMenuItem] = useState({ itemName: "" });
  const [newCustomItem, setNewCustomItem] = useState({
    itemName: "",
    itemPrice: "",
  });
  const [categoryImage, setCategoryImage] = useState([]);
  const [loading, setLoading] = useState(true);

  const foodTypes = ["Veg", "Non-Veg", "Jain", "Both"];
  const categoryOptions = ["Basic", "Standard", "Premium", "Luxury"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mandapsData, catererData] = await Promise.all([
          getProviderMandaps(),
          getCatererById(id),
        ]);
        setMandaps(mandapsData);
        const menuCategory =
          catererData.menuCategory?.length > 0
            ? catererData.menuCategory
            : [
                {
                  category: "",
                  menuItems: [],
                  pricePerPlate: "",
                  categoryImage: "",
                },
              ];
        setFormData({
          mandapId: catererData.mandapId || "",
          catererName: catererData.catererName || "",
          menuCategory,
          foodType: Array.isArray(catererData.foodType)
            ? catererData.foodType
            : [],
          isCustomizable: catererData.isCustomizable || false,
          customizableItems: catererData.customizableItems || [],
          hasTastingSession: catererData.hasTastingSession || false,
          isActive: catererData.isActive ?? true,
        });
        setCategoryImage(menuCategory.map((cat) => cat.categoryImage || ""));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load caterer data.");
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

  const handleArrayToggle = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const addMenuCategory = () => {
    setFormData((prev) => ({
      ...prev,
      menuCategory: [
        ...prev.menuCategory,
        {
          category: "",
          menuItems: [],
          pricePerPlate: "",
          categoryImage: "",
        },
      ],
    }));
    setCategoryImage((prev) => [...prev, ""]);
  };

  const removeMenuCategory = (index) => {
    setFormData((prev) => ({
      ...prev,
      menuCategory: prev.menuCategory.filter((_, i) => i !== index),
    }));
    setCategoryImage((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMenuCategory = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      menuCategory: prev.menuCategory.map((cat, i) =>
        i === index ? { ...cat, [field]: value } : cat
      ),
    }));
  };

  const handleCategoryImageUpload = (index, files) => {
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      updateMenuCategory(index, "categoryImage", imageUrl);
      setCategoryImage((prev) => {
        const newImages = [...prev];
        newImages[index] = file;
        return newImages;
      });
    }
  };

  const addMenuItem = (categoryIndex) => {
    if (!newMenuItem.itemName) {
      toast.error("Please enter a menu item name.");
      return;
    }
    const updatedCategories = [...formData.menuCategory];
    updatedCategories[categoryIndex].menuItems.push({
      itemName: newMenuItem.itemName,
    });
    setFormData((prev) => ({ ...prev, menuCategory: updatedCategories }));
    setNewMenuItem({ itemName: "" });
  };

  const removeMenuItem = (categoryIndex, itemIndex) => {
    const updatedCategories = [...formData.menuCategory];
    updatedCategories[categoryIndex].menuItems = updatedCategories[
      categoryIndex
    ].menuItems.filter((_, i) => i !== itemIndex);
    setFormData((prev) => ({ ...prev, menuCategory: updatedCategories }));
  };

  const addCustomizableItem = () => {
    if (!newCustomItem.itemName || !newCustomItem.itemPrice) {
      toast.error(
        "Please enter both item name and price for customizable item."
      );
      return;
    }
    setFormData((prev) => ({
      ...prev,
      customizableItems: [
        ...prev.customizableItems,
        {
          itemName: newCustomItem.itemName,
          itemPrice: parseFloat(newCustomItem.itemPrice),
        },
      ],
    }));
    setNewCustomItem({ itemName: "", itemPrice: "" });
  };

  const removeCustomizableItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      customizableItems: prev.customizableItems.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (!formData.mandapId) {
        toast.error("Please select a mandap.");
        return;
      }
      if (!formData.catererName) {
        toast.error("Please enter a caterer name.");
        return;
      }
      if (formData.foodType.length === 0) {
        toast.error("Please select at least one food type.");
        return;
      }
      if (
        formData.menuCategory.some(
          (cat) => !cat.category || !cat.pricePerPlate || !cat.menuItems.length
        )
      ) {
        toast.error(
          "Please fill all menu category details and add at least one menu item per category."
        );
        return;
      }
      if (formData.isCustomizable && formData.customizableItems.length === 0) {
        toast.error("Please add at least one customizable item.");
        return;
      }

      const catererData = {
        mandapId: formData.mandapId,
        catererName: formData.catererName,
        menuCategory: formData.menuCategory,
        foodType: formData.foodType,
        isCustomizable: formData.isCustomizable,
        customizableItems: formData.customizableItems,
        hasTastingSession: formData.hasTastingSession,
      };

      console.log("Submitting caterer data:", catererData);
      console.log("Submitting category images:", categoryImage);

      await updateCaterer(
        id,
        catererData,
        categoryImage.filter((file) => file && file instanceof File)
      );
      toast.success("Caterer updated successfully!");
      navigate("/vendors");
    } catch (error) {
      console.error("Error updating caterer:", error);
      toast.error(error.response?.data?.error || "Failed to update caterer.");
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
    <div className="mx-auto space-y-6 p-4 sm:p-6 font-inter">
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
          Edit Caterer
        </h1>
      </div>

      <Card className="border-none shadow-lg rounded-2xl bg-white">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Caterer Name"
                value={formData.catererName}
                onChange={(e) =>
                  handleInputChange("catererName", e.target.value)
                }
                placeholder="Enter caterer name"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {foodTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.foodType.includes(type)}
                      onChange={() => handleArrayToggle("foodType", type)}
                      className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Menu Categories
                </h3>
                <Button
                  type="button"
                  onClick={addMenuCategory}
                  icon={<Plus className="h-4 w-4" />}
                  size="sm"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-4 py-2"
                >
                  Add Menu Category
                </Button>
              </div>

              {formData.menuCategory.map((category, categoryIndex) => (
                <div
                  key={categoryIndex}
                  className="bg-yellow-50 p-4 rounded-lg mb-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold text-gray-900">
                      Category #{categoryIndex + 1}
                    </h4>
                    {formData.menuCategory.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeMenuCategory(categoryIndex)}
                        variant="danger"
                        size="sm"
                        className="bg-red-600 text-white hover:bg-red-700 rounded-full px-3 py-1"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Select
                      label="Menu Category"
                      options={[
                        { value: "", label: "Select category" },
                        ...categoryOptions.map((cat) => ({
                          value: cat,
                          label: cat,
                        })),
                      ]}
                      value={category.category}
                      onChange={(value) =>
                        updateMenuCategory(categoryIndex, "category", value)
                      }
                      fullWidth
                      className="text-base font-medium"
                    />
                    <Input
                      label="Category Price (₹ per plate)"
                      type="number"
                      value={category.pricePerPlate}
                      onChange={(e) =>
                        updateMenuCategory(
                          categoryIndex,
                          "pricePerPlate",
                          e.target.value
                        )
                      }
                      placeholder="₹ 0"
                      fullWidth
                      className="text-base font-medium"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Menu Items
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                      <Input
                        placeholder="Enter menu item"
                        value={newMenuItem.itemName}
                        onChange={(e) =>
                          setNewMenuItem((prev) => ({
                            ...prev,
                            itemName: e.target.value,
                          }))
                        }
                        className="w-full sm:w-2/3 text-base font-medium"
                      />
                      <Button
                        type="button"
                        onClick={() => addMenuItem(categoryIndex)}
                        icon={<Plus className="h-4 w-4" />}
                        size="sm"
                        className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-4 py-2"
                      >
                        Add Item
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {category.menuItems.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {item.itemName}
                          </span>
                          <Button
                            type="button"
                            onClick={() =>
                              removeMenuItem(categoryIndex, itemIndex)
                            }
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-1"
                            icon={<X className="h-4 w-4" />}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="text-sm font-medium text-gray-600">
                        Upload category image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id={`category-image-${categoryIndex}`}
                        onChange={(e) =>
                          handleCategoryImageUpload(
                            categoryIndex,
                            e.target.files
                          )
                        }
                      />
                      <label
                        htmlFor={`category-image-${categoryIndex}`}
                        className="mt-2 inline-block cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
                      >
                        Choose Image
                      </label>
                    </div>
                    {category.categoryImage && (
                      <div className="mt-2 relative">
                        <img
                          src={category.categoryImage}
                          alt={`Category ${categoryIndex + 1}`}
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateMenuCategory(
                              categoryIndex,
                              "categoryImage",
                              ""
                            );
                            setCategoryImage((prev) => {
                              const newImages = [...prev];
                              newImages[categoryIndex] = "";
                              return newImages;
                            });
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isCustomizable}
                    onChange={(e) =>
                      handleInputChange("isCustomizable", e.target.checked)
                    }
                    className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Customization Allowed
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hasTastingSession}
                    onChange={(e) =>
                      handleInputChange("hasTastingSession", e.target.checked)
                    }
                    className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Tasting Session Available
                  </span>
                </label>
              </div>
            </div>

            {formData.isCustomizable && (
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">
                  Customizable Items
                </h4>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <Input
                    placeholder="Enter customizable item"
                    value={newCustomItem.itemName}
                    onChange={(e) =>
                      setNewCustomItem((prev) => ({
                        ...prev,
                        itemName: e.target.value,
                      }))
                    }
                    className="w-full sm:w-7/12 text-base font-medium"
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    value={newCustomItem.itemPrice}
                    onChange={(e) =>
                      setNewCustomItem((prev) => ({
                        ...prev,
                        itemPrice: e.target.value,
                      }))
                    }
                    className="w-full sm:w-3/12 text-base font-medium"
                  />
                  <Button
                    type="button"
                    onClick={addCustomizableItem}
                    icon={<Plus className="h-4 w-4" />}
                    size="sm"
                    className="w-full sm:w-2/12 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-4 py-2"
                  >
                    Add Item
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.customizableItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {item.itemName} - ₹{item.itemPrice}
                      </span>
                      <Button
                        type="button"
                        onClick={() => removeCustomizableItem(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-1"
                        icon={<X className="h-4 w-4" />}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                Update Caterer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCatererFormPage;
