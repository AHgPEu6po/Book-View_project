import React, { useState } from "react";
import Select from "react-select";
import { assets, cinemas, cities, districts } from "../assets/assets";

const Cinemas = () => {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption ? selectedOption.value : null);
    setSelectedDistricts([]);
  };

  const handleDistrictChange = (selectedOptions) => {
    setSelectedDistricts(selectedOptions ? selectedOptions.map(opt => opt.value) : []);
  };

  const filteredCinemas = cinemas.filter(cinema => {
    const matchesSearch =
      cinema.name.toLowerCase().includes(search.toLowerCase()) ||
      cinema.address.toLowerCase().includes(search.toLowerCase());

    const matchesCity = selectedCity ? cinema.city === selectedCity : true;

    const matchesDistrict = selectedDistricts.length > 0
      ? selectedDistricts.includes(cinema.district)
      : true;

    return matchesSearch && matchesCity && matchesDistrict;
  });

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#C4C7D2",
      borderRadius: "15px",
      boxShadow: "none",
      "&:hover": { borderColor: "none" }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#E5E7EB",
      borderRadius: "8px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#6B7280"
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      borderRadius: "8px",
      cursor: "pointer",
      padding: "2px",
      "&:hover": {
        backgroundColor: "#E8A7AF",
        color: "#111827"
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#800020"
        : state.isFocused
        ? "#E8A7AF"
        : "white",
      color: state.isSelected ? "white" : "#111827",
      cursor: "pointer",
    }),
  };

  return (
    <div className="flex flex-col sm:flex-row gap-8 p-6">
      <div className="md:w-1/4 sm:w-1/3 w-full space-y-6 sm:sticky top-4 self-start">

        <div className="flex gap-2 border border-borderColor px-3 rounded-full">
          <input type="text" placeholder="Пошук за назвою або адресою" value={search} 
          onChange={(e) => setSearch(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"/>
          <img className="hidden lg:flex" src={assets.search} alt="" />
        </div>

        <Select
          options={cities.map(city => ({ value: city, label: city }))}
          value={selectedCity ? { value: selectedCity, label: selectedCity } : null}
          onChange={handleCityChange}
          placeholder="Оберіть місто"
          isClearable
          styles={customSelectStyles}
        />

        <div>
            <Select
            isMulti
            options={
                selectedCity
                ? districts[selectedCity].map(d => ({ value: d, label: d }))
                : []
            }
            value={selectedDistricts.map(d => ({ value: d, label: d }))}
            onChange={handleDistrictChange}
            placeholder="Оберіть райони..."
            isClearable
            isDisabled={!selectedCity}
            styles={customSelectStyles}
            />
            {!selectedCity && (
                <p className="text-gray-500 text-sm mt-2">Оберіть місто, щоб обрати райони</p>
            )}
        </div>
      </div>

      <div className="md:w-3/4 w-full space-y-4">
        {filteredCinemas.map(cinema => (
          <div
            key={cinema._id}
            className="flex items-center gap-4 border border-borderColor p-4 rounded-lg hover:shadow-md transition"
          >
            <img
              src={cinema.image}
              alt={cinema.name}
              className="w-36 object-cover rounded-xl"
            />
            <div>
              <h3 className="font-semibold text-lg">{cinema.name}</h3>
              <p className="text-gray-500">{cinema.address}</p>
            </div>
          </div>
        ))}

        {filteredCinemas.length === 0 && (
          <p className="text-gray-500">Нічого не знайдено</p>
        )}
      </div>
    </div>
  );
};

export default Cinemas;
