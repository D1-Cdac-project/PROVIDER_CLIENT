import axios from "axios";
import toast from "react-hot-toast";
import { getProviderToken } from "../utils/providerCookieUtils";

const BASE_URL = "http://localhost:4000/api/provider";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const providerToken = getProviderToken();
  if (providerToken) {
    config.headers.Authorization = `Bearer ${providerToken}`;
  }
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Caterer API Error:", error.response || error.message);
    if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else if (error.message) {
      toast.error("Network error. Please try again.");
    }
    return Promise.reject(error);
  }
);

export const addCaterer = async (
  {
    mandapId,
    catererName,
    about,
    profileImage,
    menuCategory,
    foodType,
    isCustomizable,
    customizableItems,
    hasTastingSession,
  },
  categoryImage
) => {
  const formData = new FormData();
  formData.append("mandapId", mandapId);
  formData.append("catererName", catererName);
  formData.append("about", about || "");
  formData.append("profileImage", profileImage || "");
  formData.append("menuCategory", JSON.stringify(menuCategory));
  formData.append("foodType", JSON.stringify(foodType));
  formData.append("isCustomizable", isCustomizable.toString());
  formData.append("customizableItems", JSON.stringify(customizableItems));
  formData.append("hasTastingSession", hasTastingSession.toString());

  if (profileImage && profileImage instanceof File) {
    console.log("Appending profileImage file:", profileImage.name);
    formData.append("profileImage", profileImage);
  }

  categoryImage.forEach((file, index) => {
    if (file && file instanceof File) {
      console.log(`Appending file for categoryImage[${index}]:`, file.name);
      formData.append(`categoryImage[${index}]`, file);
    }
  });

  const response = await api.post("/add-caterer", formData);
  return response.data.data;
};

export const updateCaterer = async (catererId, catererData, categoryImage) => {
  const formData = new FormData();
  formData.append("mandapId", catererData.mandapId);
  formData.append("catererName", catererData.catererName);
  formData.append("about", catererData.about || "");
  formData.append("profileImage", catererData.profileImage || "");
  formData.append("menuCategory", JSON.stringify(catererData.menuCategory));
  formData.append("foodType", JSON.stringify(catererData.foodType));
  formData.append("isCustomizable", catererData.isCustomizable.toString());
  formData.append(
    "customizableItems",
    JSON.stringify(catererData.customizableItems)
  );
  formData.append(
    "hasTastingSession",
    catererData.hasTastingSession.toString()
  );

  if (catererData.profileImage && catererData.profileImage instanceof File) {
    console.log("Appending profileImage file:", catererData.profileImage.name);
    formData.append("profileImage", catererData.profileImage);
  }

  categoryImage.forEach((file, index) => {
    if (file && file instanceof File) {
      console.log(`Appending file for categoryImage[${index}]:`, file.name);
      formData.append(`categoryImage[${index}]`, file);
    }
  });

  const response = await api.put(`/update-caterer/${catererId}`, formData);
  return response.data.data;
};

export const deleteCaterer = async (catererId) => {
  const response = await api.delete(`/delete-caterer/${catererId}`);
  return response.data.data;
};

export const getCatererById = async (catererId) => {
  const response = await api.get(`/get-caterer/${catererId}`);
  const caterer = response.data.data.caterer;
  return {
    ...caterer,
    mandapId: caterer.mandapId?._id || caterer.mandapId || "",
    menuCategory: caterer.menuCategory || [],
    foodType: Array.isArray(caterer.foodType) ? caterer.foodType : [],
    about: caterer.about || "",
    profileImage: caterer.profileImage || "",
  };
};

export const getAllCaterers = async () => {
  const response = await api.get("/get-all-caterers");
  return response.data.data.caterers.map((caterer) => ({
    ...caterer,
    menuCategory: caterer.menuCategory || [],
    foodType: Array.isArray(caterer.foodType) ? caterer.foodType : [],
    about: caterer.about || "",
    profileImage: caterer.profileImage || "",
  }));
};

export const getCaterersByMandapId = async (mandapId) => {
  const response = await api.get(`/get-all-caterer/${mandapId}`);
  return response.data.data.caterers.map((caterer) => ({
    ...caterer,
    mandapId: caterer.mandapId?._id || caterer.mandapId || "",
    menuCategory: caterer.menuCategory || [],
    foodType: Array.isArray(caterer.foodType) ? caterer.foodType : [],
    about: caterer.about || "",
    profileImage: caterer.profileImage || "",
  }));
};
