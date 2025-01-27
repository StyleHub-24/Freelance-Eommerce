import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const countryData = [
  { code: 'IN', name: 'India', phoneCode: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', phoneCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', phoneCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', phoneCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', phoneCode: '+61', flag: '🇦🇺' }
];

const PhoneInput = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);
  const [phoneNumber, setPhoneNumber] = useState(value?.replace(/^\+\d+\s*/, '') || '');

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    const newNumber = phoneNumber ? `${country.phoneCode} ${phoneNumber}` : '';
    onChange({ target: { name: 'phoneNumber', value: newNumber } });
  };

  const handlePhoneChange = (e) => {
    const newNumber = e.target.value.replace(/[^\d]/g, '');
    setPhoneNumber(newNumber);
    onChange({ 
      target: { 
        name: 'phoneNumber', 
        value: newNumber ? `${selectedCountry.phoneCode} ${newNumber}` : '' 
      } 
    });
  };

  return (
    <div className="relative flex">
      <div className="relative">
        <button
          type="button"
          className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="mr-2">{selectedCountry.flag}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-56 bg-white border border-gray-300 rounded-md shadow-lg">
            <ul className="py-1 max-h-60 overflow-auto">
              {countryData.map((country) => (
                <li
                  key={country.code}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="mr-2">{country.flag}</span>
                  <span className="mr-2">{country.name}</span>
                  <span className="text-gray-500">{country.phoneCode}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-black focus:border-transparent"
        placeholder="Enter phone number"
      />
    </div>
  );
};

export default PhoneInput;