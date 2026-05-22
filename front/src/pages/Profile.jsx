import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { AppContext } from "../context/AppContext";
import { allGenres, cities, districts } from "../assets/assets";

const Profile = () => {
  const { backendUrl, token, customSelectStyles } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthYear: "",
    city: "",
    district: "",
    favoriteGenres: [],
    excludedGenres: [],
  });

  const fetchUser = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/user/me", {
        headers: {
          token,
        },
      });

      if (res.data.success) {
        const user = res.data.user;

        setFormData({
          name: user.name || "",
          email: user.email || "",
          birthYear: user.birthYear || "",
          city: user.city || "",
          district: user.district || "",
          favoriteGenres: user.favoriteGenres || [],
          excludedGenres: user.excludedGenres || [],
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    try {
      setSaving(true);

      const res = await axios.put(
        backendUrl + "/api/user/me",
        {
          name: formData.name,
          birthYear: formData.birthYear,
          favoriteGenres: formData.favoriteGenres,
          excludedGenres: formData.excludedGenres,
          city: formData.city,
          district: formData.district,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (res.data.success) {
        alert("Профіль оновлено");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Помилка при оновленні профілю");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const currentYear = new Date().getFullYear();

  const years = Array.from(
  { length: currentYear - 1899 },
    (_, index) => {
        const year = currentYear - index;

        return {
        value: year,
        label: year.toString(),
        };
    }
  );

  const availableFavoriteGenres = allGenres.filter(
    (genre) => !formData.excludedGenres.includes(genre)
  );

  const availableExcludedGenres = allGenres.filter(
    (genre) => !formData.favoriteGenres.includes(genre)
  );

  const handleCityChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      city: selected ? selected.value : "",
      district: "",
    }));
  };

  const handleDistrictChange = (selected) => {
    setFormData((prev) => ({
        ...prev,
        district: selected ? selected.value : "",
    }));
  };

  if (!token) {
    return (
      <div className="p-6 text-center text-gray-500">
        Увійдіть в акаунт
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Завантаження...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="border border-borderColor rounded-2xl p-6 space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Профіль
          </h1>

          <p className="text-gray-500 mt-2">
            Редагування інформації користувача
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="space-y-2">
            <label className="text-sm text-gray-600">
              Ім’я
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full border border-borderColor rounded-[15px] px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full border border-borderColor bg-gray-100 rounded-[15px] px-4 py-3 outline-none text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">
                Рік народження
            </label>

            <Select
                options={years}

                value={
                    formData.birthYear
                    ? {
                        value: formData.birthYear,
                        label: formData.birthYear.toString(),
                        }
                    : null
                }

                onChange={(selected) =>
                    setFormData((prev) => ({
                    ...prev,
                    birthYear: selected ? selected.value : "",
                    }))
                }

                placeholder="Оберіть рік"
                isClearable
                styles={customSelectStyles}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">
                Місто
            </label>

            <Select
                options={cities.map((city) => ({
                value: city,
                label: city,
                }))}

                value={
                formData.city
                    ? {
                        value: formData.city,
                        label: formData.city,
                    }
                    : null
                }

                onChange={handleCityChange}

                placeholder="Оберіть місто"
                isClearable
                styles={customSelectStyles}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-gray-600">
                Район
            </label>

            <Select
                options={
                    formData.city
                    ? districts[formData.city].map((district) => ({
                        value: district,
                        label: district,
                        }))
                    : []
                }

                value={
                    formData.district
                    ? {
                        value: formData.district,
                        label: formData.district,
                        }
                    : null
                }

                onChange={handleDistrictChange}

                placeholder="Оберіть район..."
                isClearable
                isDisabled={!formData.city}
                styles={customSelectStyles}
            />

            {!formData.city && (
                <p className="text-gray-500 text-sm mt-2">
                Оберіть місто, щоб обрати райони
                </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-gray-600">
              Улюблені жанри
            </label>

            <Select
                isMulti
                options={availableFavoriteGenres.map((genre) => ({
                    value: genre,
                    label: genre,
                }))}

                value={formData.favoriteGenres.map((genre) => ({
                    value: genre,
                    label: genre,
                }))}

                onChange={(selected) =>
                    setFormData((prev) => ({
                    ...prev,
                    favoriteGenres: selected.map((item) => item.value),
                    }))
                }

                placeholder="Оберіть жанри"
                styles={customSelectStyles}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-gray-600">
              Небажані жанри
            </label>

            <Select
                isMulti
                options={availableExcludedGenres.map((genre) => ({
                    value: genre,
                    label: genre,
                }))}

                value={formData.excludedGenres.map((genre) => ({
                    value: genre,
                    label: genre,
                }))}

                onChange={(selected) =>
                    setFormData((prev) => ({
                    ...prev,
                    excludedGenres: selected.map((item) => item.value),
                    }))
                }

                placeholder="Оберіть жанри"
                styles={customSelectStyles}
            />
          </div>

        </div>

        <button
          onClick={updateUser}
          disabled={saving}
          className="bg-primary hover:bg-primary-dull transition text-white px-6 py-3 rounded-xl"
        >
          {saving ? "Збереження..." : "Зберегти зміни"}
        </button>

      </div>
    </div>
  );
};

export default Profile;