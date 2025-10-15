/**
 * DoctorSelector Component
 *
 * Dropdown to select which doctor's schedule to view.
 * For front desk staff (can see all doctors).
 *
 * TODO for candidates:
 * 1. Fetch list of all doctors
 * 2. Display in a dropdown/select
 * 3. Show doctor name and specialty
 * 4. Handle selection change
 * 5. Consider using a custom dropdown or native select
 */

'use client';

import { useState, useEffect } from 'react';
import type { Doctor } from '@/types';
import {appointmentService} from '@/services/appointmentService';

interface DoctorSelectorProps {
  selectedDoctorId: string;
  onDoctorChange: (doctorId: string) => void;
}

/**
 * DoctorSelector Component
 *
 * A dropdown to select a doctor from the list of available doctors.
 *
 * TODO: Implement this component
 *
 * Consider:
 * - Should you fetch doctors here or accept them as props?
 * - Native <select> or custom dropdown component?
 * - How to display doctor info (name + specialty)?
 * - Should this be a reusable component?
 */
export function DoctorSelector({
  selectedDoctorId,
  onDoctorChange,
}: DoctorSelectorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // TODO: Fetch doctors  
  useEffect(() => {
     try {
      setLoading(true);
      
      // Use appointmentService to get all doctors
      const allDoctors = appointmentService.getAllDoctors();
      setDoctors(allDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Find currently selected doctor for display
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  return (
    <div className="doctor-selector space-y-2">
      {/* Label */}
      <label
        htmlFor="doctor-select"
        className="block text-sm font-medium text-gray-700"
      >
        Select Doctor
      </label>

      {/* Native Select Dropdown */}
      <select
        id="doctor-select"
        value={selectedDoctorId}
        onChange={(e) => onDoctorChange(e.target.value)}
        disabled={loading}
        className="block w-full px-4 py-2 pr-8 text-sm text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="" disabled>
          {loading ? 'Loading doctors...' : 'Select a doctor...'}
        </option>
        
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
             {doctor.name} - {doctor.specialty.charAt(0).toUpperCase() + doctor.specialty.slice(1)}
          </option>
        ))}
      </select>

      {/* Display selected doctor details */}
      {selectedDoctor && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm">
            <p className="font-semibold text-gray-800">
              {selectedDoctor.name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Specialty:</span>{' '}
              {selectedDoctor.specialty.charAt(0).toUpperCase() + selectedDoctor.specialty.slice(1)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Contact:</span>{' '}
              {selectedDoctor.phone}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Email:</span>{' '}
              {selectedDoctor.email}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && doctors.length === 0 && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            No doctors available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}


//bonus code for custom doctor selector component
export function CustomDoctorSelector({
  selectedDoctorId,
  onDoctorChange,
}: DoctorSelectorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch doctors
  useEffect(() => {
    try {
      setLoading(true);
      const allDoctors = appointmentService.getAllDoctors();
      setDoctors(allDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Find selected doctor
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="custom-doctor-selector space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Doctor
      </label>

      <div className="relative">
        {/* Dropdown Button */}
        <button
          type="button"
          className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          disabled={loading}
        >
          <div className="flex items-center justify-between">
            <div>
              {selectedDoctor ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">
                     {selectedDoctor.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedDoctor.specialty.charAt(0).toUpperCase() + selectedDoctor.specialty.slice(1)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {loading ? 'Loading doctors...' : 'Select a doctor...'}
                </p>
              )}
            </div>
            
            {/* Dropdown Icon */}
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {doctors.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No doctors available
              </div>
            ) : (
              doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  type="button"
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors ${
                    doctor.id === selectedDoctorId ? 'bg-blue-100' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDoctorChange(doctor.id);
                    setIsOpen(false);
                  }}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                       {doctor.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doctor.specialty.charAt(0).toUpperCase() + doctor.specialty.slice(1)} • {doctor.phone}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Selected doctor details */}
      {selectedDoctor && (
        <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="text-xs space-y-1">
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {selectedDoctor.email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span> {selectedDoctor.phone}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Export DoctorSelector as default
export default DoctorSelector;