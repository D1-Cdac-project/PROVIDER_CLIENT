import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, Calendar } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { updateMandap, getMandapById } from "../../services/mandapApi";
import toast from "react-hot-toast";

const statesAndCities = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
  ],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Raigarh"],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  Haryana: ["Chandigarh", "Faridabad", "Gurgaon", "Hisar", "Rohtak"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Kullu"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
  Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  Manipur: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul"],
  Meghalaya: ["Shillong", "Tura", "Jowai", "Nongstoin", "Baghmara"],
  Mizoram: ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib"],
  Nagaland: ["Kohima", "Dimapur", "Wokha", "Mokokchung", "Tuensang"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Puri"],
  Punjab: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  Sikkim: ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Singtam"],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
  ],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
  Tripura: ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi"],
  Uttarakhand: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Almora"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Andaman and Nicobar Islands": [
    "Port Blair",
    "Havelock",
    "Neil Island",
    "Diglipur",
    "Rangat",
  ],
  Chandigarh: ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa", "Diu"],
  Lakshadweep: ["Kavaratti", "Agatti", "Minicoy"],
  Delhi: [
    "New Delhi",
    "Central Delhi",
    "South Delhi",
    "North Delhi",
    "East Delhi",
  ],
  Ladakh: ["Leh", "Kargil"],
  "Jammu and Kashmir": [
    "Srinagar",
    "Jammu",
    "Anantnag",
    "Baramulla",
    "Udhampur",
  ],
  Puducherry: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
};

export default function EditMandapPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mandapName: "",
    mandapDesc: "",
    availableDates: [],
    venueType: [],
    address: {
      fullAddress: "",
      city: "",
      state: "",
      pinCode: "",
    },
    penaltyChargesPerHour: "",
    cancellationPolicy: "",
    venueImages: [],
    guestCapacity: "",
    venuePricing: "",
    securityDeposit: "",
    securityDepositType: "",
    amenities: [],
    outdoorFacilities: [],
    advancePayment: "",
    paymentMethods: [],
    isExternalCateringAllowed: false,
  });
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    const fetchMandapData = async () => {
      try {
        setLoading(true);
        const response = await getMandapById(id);
        const mandap = response.mandap;
        console.log("Fetched mandap data:", mandap);
        setFormData({
          mandapName: mandap.mandapName || "",
          mandapDesc: mandap.mandapDesc || "",
          availableDates: Array.isArray(mandap.availableDates)
            ? mandap.availableDates.map(
                (date) => new Date(date).toISOString().split("T")[0]
              )
            : [],
          venueType: Array.isArray(mandap.venueType) ? mandap.venueType : [],
          address: {
            fullAddress: mandap.address?.fullAddress || "",
            city: mandap.address?.city || "",
            state: mandap.address?.state || "",
            pinCode: mandap.address?.pinCode || "",
          },
          penaltyChargesPerHour: mandap.penaltyChargesPerHour
            ? mandap.penaltyChargesPerHour.toString()
            : "",
          cancellationPolicy: mandap.cancellationPolicy || "",
          venueImages: Array.isArray(mandap.venueImages)
            ? mandap.venueImages
            : [],
          guestCapacity: mandap.guestCapacity
            ? mandap.guestCapacity.toString()
            : "",
          venuePricing: mandap.venuePricing
            ? mandap.venuePricing.toString()
            : "",
          securityDeposit: mandap.securityDeposit
            ? mandap.securityDeposit.toString()
            : "",
          securityDepositType: mandap.securityDepositType || "",
          amenities: Array.isArray(mandap.amenities) ? mandap.amenities : [],
          outdoorFacilities: Array.isArray(mandap.outdoorFacilities)
            ? mandap.outdoorFacilities
            : [],
          advancePayment: mandap.advancePayment
            ? mandap.advancePayment.toString()
            : "",
          paymentMethods: Array.isArray(mandap.paymentOptions)
            ? mandap.paymentOptions
            : [],
          isExternalCateringAllowed: !!mandap.isExternalCateringAllowed,
        });
        setAvailableCities(statesAndCities[mandap.address?.state] || []);
      } catch (error) {
        console.error("Error fetching mandap data:", error);
        toast.error("Failed to load mandap data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMandapData();
  }, [id]);

  useEffect(() => {
    if (formData.address.state) {
      setAvailableCities(statesAndCities[formData.address.state] || []);
      if (
        !statesAndCities[formData.address.state]?.includes(
          formData.address.city
        )
      ) {
        setFormData((prev) => ({
          ...prev,
          address: { ...prev.address, city: "" },
        }));
      }
    } else {
      setAvailableCities([]);
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, city: "" },
      }));
    }
  }, [formData.address.state]);

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

  const handleArrayToggle = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleDateAdd = (date) => {
    if (date && !formData.availableDates.includes(date)) {
      setFormData((prev) => ({
        ...prev,
        availableDates: [...prev.availableDates, date],
      }));
    }
  };

  const handleDateRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      availableDates: prev.availableDates.filter((_, i) => i !== index),
    }));
  };

  const handleImageAdd = (files) => {
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => file);
      setFormData((prev) => ({
        ...prev,
        venueImages: [...prev.venueImages, ...newImages],
      }));
    }
  };

  const handleImageRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      venueImages: prev.venueImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.mandapName ||
      !formData.mandapDesc ||
      !formData.address.fullAddress ||
      !formData.address.city ||
      !formData.address.state ||
      !formData.address.pinCode ||
      !formData.penaltyChargesPerHour ||
      !formData.cancellationPolicy ||
      !formData.guestCapacity ||
      !formData.venuePricing ||
      !formData.securityDeposit ||
      !formData.securityDepositType ||
      !formData.advancePayment
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const mandapData = {
        mandapName: formData.mandapName,
        mandapDesc: formData.mandapDesc,
        city: formData.address.city,
        state: formData.address.state,
        pinCode: formData.address.pinCode,
        availableDates: formData.availableDates,
        venueType: formData.venueType,
        penaltyChargesPerHour: parseFloat(formData.penaltyChargesPerHour) || 0,
        cancellationPolicy: formData.cancellationPolicy,
        guestCapacity: parseInt(formData.guestCapacity) || 0,
        venuePricing: parseFloat(formData.venuePricing) || 0,
        securityDeposit: parseFloat(formData.securityDeposit) || 0,
        securityDepositType: formData.securityDepositType,
        amenities: formData.amenities,
        outdoorFacilities: formData.outdoorFacilities,
        paymentOptions: formData.paymentMethods,
        isExternalCateringAllowed: formData.isExternalCateringAllowed,
        fullAddress: formData.address.fullAddress,
        advancePayment: parseFloat(formData.advancePayment) || 0,
      };

      console.log("Submitting update data:", mandapData);
      await updateMandap(id, mandapData, formData.venueImages);
      toast.success("Mandap updated successfully!");
      navigate("/mandaps");
    } catch (error) {
      console.error("Error updating mandap:", error);
      toast.error("Failed to update mandap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/mandaps")}
        >
          Back
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 ml-4">
          Edit Mandap
        </h1>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-6">
            <div>
              <Input
                label="Mandap Name"
                value={formData.mandapName}
                onChange={(e) =>
                  handleInputChange("mandapName", e.target.value)
                }
                placeholder="Enter mandap name"
                required
                fullWidth
              />
            </div>

            <div>
              <Textarea
                label="Mandap Description"
                value={formData.mandapDesc}
                onChange={(e) =>
                  handleInputChange("mandapDesc", e.target.value)
                }
                placeholder="Enter description of the mandap"
                required
                fullWidth
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Dates
              </label>
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="flex-1 block border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleDateAdd(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.availableDates.map((date, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-primary-100 rounded-full px-3 py-1 text-sm"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(date).toLocaleDateString()}</span>
                    <button
                      type="button"
                      onClick={() => handleDateRemove(index)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Type
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {[
                  "Banquet Hall",
                  "Community Hall",
                  "Lawn",
                  "Resort",
                  "Farmhouse",
                  "Hotel",
                  "Rooftop",
                  "Convention Centre",
                ].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.venueType.includes(type)}
                      onChange={() => handleArrayToggle("venueType", type)}
                      className="mr-2"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Select
                label="State"
                options={[
                  { value: "", label: "Select state" },
                  ...Object.keys(statesAndCities).map((state) => ({
                    value: state,
                    label: state,
                  })),
                ]}
                value={formData.address.state}
                onChange={(value) => {
                  handleInputChange("address.state", value);
                  handleInputChange("address.city", "");
                }}
                fullWidth
              />
              <Select
                label="City"
                options={[
                  { value: "", label: "Select city" },
                  ...availableCities.map((city) => ({
                    value: city,
                    label: city,
                  })),
                ]}
                value={formData.address.city}
                onChange={(value) => handleInputChange("address.city", value)}
                fullWidth
                disabled={!formData.address.state}
              />
              <Input
                label="Pin Code"
                value={formData.address.pinCode}
                onChange={(e) =>
                  handleInputChange("address.pinCode", e.target.value)
                }
                placeholder="Enter pin code"
                fullWidth
              />
            </div>

            <Textarea
              label="Full Address"
              value={formData.address.fullAddress}
              onChange={(e) =>
                handleInputChange("address.fullAddress", e.target.value)
              }
              placeholder="Enter complete venue address"
              required
              fullWidth
              rows={3}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Penalty Charges per Hour (₹)"
                type="number"
                value={formData.penaltyChargesPerHour}
                onChange={(e) =>
                  handleInputChange("penaltyChargesPerHour", e.target.value)
                }
                placeholder="₹"
                required
                fullWidth
              />
              <Select
                label="Cancellation Policy"
                options={[
                  { value: "", label: "Select cancellation policy" },
                  { value: "No Refund", label: "No Refund" },
                  { value: "Partial Refund", label: "Partial Refund" },
                  { value: "Full Refund", label: "Full Refund" },
                ]}
                value={formData.cancellationPolicy}
                onChange={(value) =>
                  handleInputChange("cancellationPolicy", value)
                }
                required
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Upload venue images (Multiple selection allowed)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="venue-images"
                  onChange={(e) => handleImageAdd(e.target.files)}
                />
                <label
                  htmlFor="venue-images"
                  className="mt-2 inline-block cursor-pointer bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600"
                >
                  Choose Images
                </label>
              </div>
              {formData.venueImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {formData.venueImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={
                          image instanceof File
                            ? URL.createObjectURL(image)
                            : image
                        }
                        alt={`Venue ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Guest Capacity (max)"
                type="number"
                value={formData.guestCapacity}
                onChange={(e) =>
                  handleInputChange("guestCapacity", e.target.value)
                }
                required
                fullWidth
              />
              <Input
                label="Venue Pricing (₹)"
                type="number"
                value={formData.venuePricing}
                onChange={(e) =>
                  handleInputChange("venuePricing", e.target.value)
                }
                placeholder="₹ 0"
                required
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Security Deposit (₹)"
                type="number"
                value={formData.securityDeposit}
                onChange={(e) =>
                  handleInputChange("securityDeposit", e.target.value)
                }
                placeholder="₹ 0"
                required
                fullWidth
              />
              <Select
                label="Security Deposit Type"
                options={[
                  { value: "", label: "Select deposit type" },
                  { value: "Refundable", label: "Refundable" },
                  { value: "Non-Refundable", label: "Non-Refundable" },
                ]}
                value={formData.securityDepositType}
                onChange={(value) =>
                  handleInputChange("securityDepositType", value)
                }
                required
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Advance Payment Required (%)"
                type="number"
                value={formData.advancePayment}
                onChange={(e) =>
                  handleInputChange("advancePayment", e.target.value)
                }
                required
                fullWidth
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Methods Accepted
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {[
                    "Cash",
                    "Credit Card",
                    "Debit Card",
                    "UPI",
                    "Net Banking",
                  ].map((method) => (
                    <label key={method} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.includes(method)}
                        onChange={() =>
                          handleArrayToggle("paymentMethods", method)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Indoor Amenities
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {[
                    "WiFi",
                    "Parking",
                    "Air Conditioning",
                    "Catering Service",
                    "Decoration Service",
                    "Sound System",
                    "Lighting System",
                    "Projector",
                    "Stage",
                    "Dance Floor",
                    "Generator",
                    "Security Service",
                    "Elevator",
                  ].map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleArrayToggle("amenities", amenity)}
                        className="mr-2"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outdoor Facilities
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {[
                    "Garden",
                    "Pool",
                    "Beach Access",
                    "Smoking Zones",
                    "Outdoor Lighting",
                    "Parking Area",
                    "Kids Play Area",
                    "Outdoor Bar",
                    "Barbeque Area",
                    "Terrace",
                  ].map((facility) => (
                    <label key={facility} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.outdoorFacilities.includes(facility)}
                        onChange={() =>
                          handleArrayToggle("outdoorFacilities", facility)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isExternalCateringAllowed}
                  onChange={(e) =>
                    handleInputChange(
                      "isExternalCateringAllowed",
                      e.target.checked
                    )
                  }
                  className="mr-2"
                />
                <label className="text-sm">External Catering Allowed</label>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              loading={loading}
              icon={<Save className="h-4 w-4" />}
              className="bg-primary-500 hover:bg-primary-600 mt-6"
              fullWidth
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
