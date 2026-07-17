'use client';

import {
  X,
  Save,
  Plus,
  Globe,
  Clock,
  Award,
  MapPin,
  Trash2,
  BookOpen,
  Settings2,
  Briefcase,
  Building2,
  DollarSign,
  ChevronDown,
  GraduationCap,
  ImageIcon,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import ImageUploadManagerSingle from '@/app/dashboard/media/example/imagebb/components/ImageUploadManagerSingle';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

import type { ServiceCountryData, ServiceCourse, ServiceDegreeLevel, ServiceUniversity } from './types';

interface CountryEditorProps {
  initialValue: ServiceCountryData;
  mode: 'add' | 'edit';
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (value: ServiceCountryData) => void;
}

const inputClass =
  'bg-zinc-900 border-zinc-800 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20 text-white rounded-lg';

export default function CountryEditor({ initialValue, mode, isSaving, onCancel, onSubmit }: CountryEditorProps) {
  const [formData, setFormData] = useState<ServiceCountryData>(() => structuredClone(initialValue));
  const [cityInput, setCityInput] = useState('');
  const [expandedUni, setExpandedUni] = useState<string | null>(null);

  // Auto-expand first university on load if edit mode
  useEffect(() => {
    if (mode === 'edit' && formData.universitys.length > 0 && !expandedUni) {
      setExpandedUni(formData.universitys[0].id);
    }
  }, [mode, formData.universitys, expandedUni]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateRootField = (field: keyof ServiceCountryData, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const addCity = () => {
    const trimmed = cityInput.trim();
    if (trimmed && !formData.city.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      updateRootField('city', [...formData.city, trimmed]);
      setCityInput('');
    }
  };

  const removeCity = (index: number) => {
    const cityToRemove = formData.city[index];
    updateRootField(
      'city',
      formData.city.filter((_, i) => i !== index),
    );
    // Unset location for universities that belonged to this city
    setValue(current => ({
      ...current,
      universitys: current.universitys.map(university => (university.location === cityToRemove ? { ...university, location: '' } : university)),
    }));
  };

  // Helper helper to support legacy structures if needed
  const setValue = (fn: (current: ServiceCountryData) => ServiceCountryData) => {
    setFormData(current => fn(current));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUniversityChange = (index: number, field: keyof ServiceUniversity, val: any) => {
    const updatedUnis = [...formData.universitys];
    updatedUnis[index] = { ...updatedUnis[index], [field]: val };
    updateRootField('universitys', updatedUnis);
  };

  const addUniversity = () => {
    const newUni: ServiceUniversity = {
      id: `UNI-${Date.now()}`,
      name: 'New University',
      image: '',
      location: formData.city[0] || '',
      description: '',
      courses: [],
    };
    updateRootField('universitys', [newUni, ...formData.universitys]);
    setExpandedUni(newUni.id);
  };

  const removeUniversity = (index: number) => {
    const updatedUnis = formData.universitys.filter((_, i) => i !== index);
    updateRootField('universitys', updatedUnis);
    if (expandedUni && formData.universitys[index]?.id === expandedUni) {
      setExpandedUni(updatedUnis[0]?.id || null);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCourseChange = (uniIndex: number, courseIndex: number, field: keyof ServiceCourse, val: any) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], [field]: val };
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const handleApplyParamChange = (uniIndex: number, courseIndex: number, paramIndex: number, val: string) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    const newParams = [...updatedCourses[courseIndex].applyBtnParms];
    newParams[paramIndex] = val;

    updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], applyBtnParms: newParams };
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const handleApplyParamDegreeLevelChange = (uniIndex: number, courseIndex: number, paramIndex: number, val: string) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    const currentParams = updatedCourses[courseIndex].applyBtnParmsDegreeLevel || [];
    const newParams = [...currentParams];

    while (newParams.length <= paramIndex) {
      newParams.push('');
    }

    newParams[paramIndex] = val;

    updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], applyBtnParmsDegreeLevel: newParams };
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const addApplyParamDegreeLevel = (uniIndex: number, courseIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    const currentParams = updatedCourses[courseIndex].applyBtnParmsDegreeLevel || [];
    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      applyBtnParmsDegreeLevel: [...currentParams, 'New Param'],
    };

    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;
    updateRootField('universitys', updatedUnis);
  };

  const removeApplyParamDegreeLevel = (uniIndex: number, courseIndex: number, paramIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    const currentParams = updatedCourses[courseIndex].applyBtnParmsDegreeLevel || [];
    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      applyBtnParmsDegreeLevel: currentParams.filter((_, i) => i !== paramIndex),
    };

    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;
    updateRootField('universitys', updatedUnis);
  };

  const addCourse = (uniIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };

    const newCourse: ServiceCourse = {
      id: `CRS-${Date.now()}`,
      name: 'New Course',
      tutionFees: '',
      duration: '',
      description: '',
      scholarship: '',
      minimumRequirement: '',
      degreeLevelInfo: [],
      applyBtnParms: [formData.country, targetUni.location, targetUni.name, 'New Course'],
      applyBtnParmsDegreeLevel: ['Degree', 'Level', 'Param'],
    };

    targetUni.courses = [...targetUni.courses, newCourse];
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const removeCourse = (uniIndex: number, courseIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };

    targetUni.courses = targetUni.courses.filter((_, i) => i !== courseIndex);
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const addDegreeLevelInfo = (uniIndex: number, courseIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];
    const targetCourse = { ...updatedCourses[courseIndex] };

    const newDegreeInfo: ServiceDegreeLevel = {
      id: `DL-${Date.now()}`,
      degreeLevel: 'Bachelor',
      tutionFees: '',
      duration: '',
    };

    targetCourse.degreeLevelInfo = [...(targetCourse.degreeLevelInfo || []), newDegreeInfo];
    updatedCourses[courseIndex] = targetCourse;
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const removeDegreeLevelInfo = (uniIndex: number, courseIndex: number, degreeIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];
    const targetCourse = { ...updatedCourses[courseIndex] };

    targetCourse.degreeLevelInfo = (targetCourse.degreeLevelInfo || []).filter((_, i) => i !== degreeIndex);
    updatedCourses[courseIndex] = targetCourse;
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const updateDegreeLevelInfo = (uniIndex: number, courseIndex: number, degreeIndex: number, field: keyof ServiceDegreeLevel, val: string) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];
    const targetCourse = { ...updatedCourses[courseIndex] };
    const updatedDegreeInfos = [...(targetCourse.degreeLevelInfo || [])];

    updatedDegreeInfos[degreeIndex] = { ...updatedDegreeInfos[degreeIndex], [field]: val };

    targetCourse.degreeLevelInfo = updatedDegreeInfos;
    updatedCourses[courseIndex] = targetCourse;
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const toggleExpand = (id: string) => {
    setExpandedUni(expandedUni === id ? null : id);
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col min-h-0 h-full bg-zinc-950 text-zinc-100 font-sans">
      {/* Header */}
      <div className="shrink-0 p-5 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-violet-600/5 pointer-events-none" />
        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 z-10">
          <Globe className="text-indigo-400" size={20} />
        </div>
        <div className="z-10">
          <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            {mode === 'add' ? 'Add Destination Country' : 'Edit Study Destinations'}
          </h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            {mode === 'add' ? 'Configure a new country destination.' : 'Manage countries, cities, and associated universities.'}
          </p>
        </div>
      </div>

      {/* Main Workspace content */}
      <ScrollArea className="flex-1 min-h-0 bg-zinc-900/10">
        {mode === 'add' ? (
          <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
            <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800 space-y-5 shadow-2xl">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Globe size={16} className="text-indigo-400" /> Country details
              </h3>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs font-medium">Country Name</Label>
                <div className="relative group">
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                  <Input
                    value={formData.country}
                    onChange={e => updateRootField('country', e.target.value)}
                    className={`${inputClass} pl-9 h-10`}
                    placeholder="e.g. Australia"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
            {/* Left side: Regional settings */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} className="text-indigo-400" /> Regional Settings
                </h3>

                <div className="bg-zinc-950/50 p-5 rounded-2xl border border-zinc-800/80 space-y-5 shadow-inner">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs font-medium">Country Name</Label>
                    <div className="relative group">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                      <Input
                        value={formData.country}
                        onChange={e => updateRootField('country', e.target.value)}
                        className={`${inputClass} pl-9`}
                        placeholder="e.g. Australia"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-zinc-400 text-xs font-medium">Popular Cities</Label>
                    <div className="flex gap-2">
                      <Input
                        value={cityInput}
                        onChange={e => setCityInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCity())}
                        className={inputClass}
                        placeholder="Add city..."
                      />
                      <Button type="button" onClick={addCity} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/25 shrink-0">
                        <Plus size={16} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.city.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/80 text-zinc-200 rounded-md text-[11px] font-medium border border-zinc-800 hover:border-indigo-500/30 hover:bg-zinc-800 transition-colors"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeCity(idx)}
                            className="text-zinc-500 hover:text-red-400 transition-colors ml-1 p-0.5 rounded-full hover:bg-white/5"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                      {formData.city.length === 0 && <span className="text-zinc-600 text-xs italic p-1">No cities added yet.</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Universities Counter Box */}
              <div className="bg-gradient-to-br from-indigo-900/10 via-zinc-900/50 to-violet-900/10 border border-indigo-500/10 rounded-2xl p-6 text-center space-y-4 backdrop-blur-md">
                <div className="w-11 h-11 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400 ring-4 ring-indigo-500/5 border border-indigo-500/20">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200">Universities</h3>
                  <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                    You have <span className="text-indigo-400 font-bold">{formData.universitys.length}</span> universities listed.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={addUniversity}
                  variant="outline"
                  className="w-full bg-zinc-950/80 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25 rounded-xl h-9"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add University
                </Button>
              </div>
            </div>

            {/* Right side: University list details */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Building2 size={14} className="text-indigo-400" /> University List
              </h3>

              {formData.universitys.length === 0 && (
                <div className="text-center py-16 bg-zinc-950/30 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <Building2 className="text-zinc-600" size={20} />
                  </div>
                  <p className="text-zinc-500 text-xs">No universities added yet.</p>
                  <Button type="button" onClick={addUniversity} variant="link" className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold">
                    Add your first university
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                {formData.universitys.map((uni, index) => (
                  <div
                    key={uni.id}
                    className={`
                      group bg-zinc-950/35 border rounded-2xl overflow-hidden transition-all duration-300
                      ${
                        expandedUni === uni.id
                          ? 'border-indigo-500/30 ring-1 ring-indigo-500/10 bg-zinc-900/40 shadow-xl'
                          : 'border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/20'
                      }
                    `}
                  >
                    <div onClick={() => toggleExpand(uni.id)} className="p-4 flex items-center justify-between cursor-pointer select-none">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-11 w-11 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 overflow-hidden shrink-0 shadow-sm group-hover:border-zinc-700 transition-colors">
                          {uni.image ? (
                            <Image width={100} height={100} src={uni.image} alt="logo" unoptimized className="w-full h-full object-cover" />
                          ) : (
                            <Building2 size={18} className="text-zinc-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className={`text-sm font-bold transition-colors ${expandedUni === uni.id ? 'text-indigo-300' : 'text-zinc-200'}`}>
                            {uni.name || 'Untitled University'}
                          </h3>
                          {uni.location ? (
                            <p className="text-zinc-500 text-[10px] flex items-center gap-1 mt-0.5 font-medium">
                              <MapPin size={10} className="text-indigo-400" /> {uni.location}
                            </p>
                          ) : (
                            <p className="text-zinc-600 text-[10px] italic mt-0.5">No location set</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity rounded-md shrink-0"
                          onClick={e => {
                            e.stopPropagation();
                            removeUniversity(index);
                          }}
                        >
                          <Trash2 size={13} />
                        </Button>
                        <div
                          className={`p-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 transition-transform duration-300 shrink-0 ${
                            expandedUni === uni.id ? 'rotate-180 text-indigo-400 border-indigo-500/30' : ''
                          }`}
                        >
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>

                    {expandedUni === uni.id && (
                      <div className="p-4 sm:p-5 pt-0 border-t border-zinc-800/60 animate-in slide-in-from-top-2 fade-in duration-300">
                        <div className="space-y-5 pt-4">
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <Label className="text-zinc-400 text-xs font-semibold">Institution Name</Label>
                              <div className="relative group/input">
                                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-hover/input:text-indigo-400 transition-colors" />
                                <Input
                                  value={uni.name}
                                  onChange={e => handleUniversityChange(index, 'name', e.target.value)}
                                  className={`${inputClass} pl-9 h-9 text-xs`}
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-zinc-400 text-xs font-semibold flex items-center gap-1">
                                Location <span className="text-zinc-600 text-[10px] font-normal">(select from cities)</span>
                              </Label>
                              <div className="relative group/select">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 z-10 group-hover/select:text-indigo-400 transition-colors" />
                                <select
                                  value={uni.location}
                                  onChange={e => handleUniversityChange(index, 'location', e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg h-9 pl-9 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer hover:bg-zinc-900/80"
                                >
                                  <option value="" disabled className="bg-zinc-900 text-zinc-500 text-xs">
                                    Select a city...
                                  </option>
                                  {formData.city.map((city, idx) => (
                                    <option key={idx} value={city} className="bg-zinc-900 text-zinc-200 text-xs">
                                      {city}
                                    </option>
                                  ))}
                                  {formData.city.length === 0 && (
                                    <option value="" disabled className="bg-zinc-900 text-zinc-500 text-xs">
                                      No cities added in regional settings
                                    </option>
                                  )}
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-zinc-500 pointer-events-none" />
                              </div>
                              {formData.city.length === 0 && (
                                <p className="text-[10px] text-amber-500/80 mt-1 pl-1">* Add cities in the regional settings sidebar first.</p>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-zinc-400 text-xs font-semibold">Description</Label>
                              <Textarea
                                value={uni.description}
                                onChange={e => handleUniversityChange(index, 'description', e.target.value)}
                                className={`${inputClass} min-h-[90px] text-xs resize-none`}
                                placeholder="Brief description of the university..."
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs font-semibold flex items-center gap-1.5">
                              <ImageIcon size={14} className="text-indigo-400" /> Cover Image
                            </Label>
                            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 transition-colors">
                              <ImageUploadManagerSingle
                                value={{ name: uni.image ? uni.name || 'University image' : '', url: uni.image }}
                                onChange={img => handleUniversityChange(index, 'image', img.url)}
                                label="University Image"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Courses Section */}
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-bold uppercase tracking-wider">
                              <GraduationCap size={14} className="text-indigo-400" />
                              <span>Available Courses ({uni.courses.length})</span>
                            </div>
                            <Button
                              type="button"
                              size="xs"
                              variant="outline"
                              onClick={() => addCourse(index)}
                              className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-indigo-600 hover:text-white h-7 text-[10px] transition-all rounded-md px-2.5"
                            >
                              <Plus size={10} className="mr-1" /> Add Course
                            </Button>
                          </div>

                          <div className="space-y-4">
                            {uni.courses.map((course, cIndex) => (
                              <div
                                key={course.id}
                                className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 relative group/course hover:border-zinc-700 transition-all duration-300 shadow-sm"
                              >
                                <div className="absolute top-2 right-2 opacity-0 group-hover/course:opacity-100 transition-opacity z-10">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeCourse(index, cIndex)}
                                    className="h-7 w-7 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md"
                                  >
                                    <Trash2 size={13} />
                                  </Button>
                                </div>

                                <div className="space-y-3 mb-3">
                                  <div className="space-y-1">
                                    <Label className="text-[9px] text-zinc-500 uppercase font-bold">Course Name</Label>
                                    <div className="relative">
                                      <Briefcase className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-600" />
                                      <Input
                                        value={course.name}
                                        onChange={e => handleCourseChange(index, cIndex, 'name', e.target.value)}
                                        className={`${inputClass} pl-8 h-8 text-xs`}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[9px] text-zinc-500 uppercase font-bold">Duration (Avg)</Label>
                                    <div className="relative">
                                      <Clock className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-600" />
                                      <Input
                                        value={course.duration}
                                        onChange={e => handleCourseChange(index, cIndex, 'duration', e.target.value)}
                                        className={`${inputClass} pl-8 h-8 text-xs`}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[9px] text-zinc-500 uppercase font-bold">Tuition Fees (Avg)</Label>
                                    <div className="relative">
                                      <DollarSign className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-600" />
                                      <Input
                                        value={course.tutionFees}
                                        onChange={e => handleCourseChange(index, cIndex, 'tutionFees', e.target.value)}
                                        className={`${inputClass} pl-8 h-8 text-xs`}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[9px] text-zinc-500 uppercase font-bold">Description</Label>
                                    <div className="relative">
                                      <BookOpen className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-600" />
                                      <Input
                                        value={course.description}
                                        onChange={e => handleCourseChange(index, cIndex, 'description', e.target.value)}
                                        className={`${inputClass} pl-8 h-8 text-xs`}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3 mb-3">
                                  <div className="space-y-1">
                                    <Label className="text-[9px] text-zinc-500 uppercase font-bold">Scholarship</Label>
                                    <Textarea
                                      value={course.scholarship}
                                      onChange={e => handleCourseChange(index, cIndex, 'scholarship', e.target.value)}
                                      className={`${inputClass} min-h-[50px] text-xs resize-none`}
                                      placeholder="Scholarship details..."
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[9px] text-zinc-500 uppercase font-bold">Minimum Requirement</Label>
                                    <Textarea
                                      value={course.minimumRequirement}
                                      onChange={e => handleCourseChange(index, cIndex, 'minimumRequirement', e.target.value)}
                                      className={`${inputClass} min-h-[50px] text-xs resize-none`}
                                      placeholder="Academic requirements..."
                                    />
                                  </div>
                                </div>

                                <div className="pt-3 border-t border-zinc-800/60 mt-3 space-y-4">
                                  {/* Degree levels sub-form */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-[9px] font-bold text-zinc-500 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Award size={11} className="text-indigo-400" /> Degree Levels Info
                                      </Label>
                                      <Button
                                        type="button"
                                        size="xs"
                                        variant="ghost"
                                        onClick={() => addDegreeLevelInfo(index, cIndex)}
                                        className="h-5 text-[9px] text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2 rounded-md"
                                      >
                                        <Plus size={10} className="mr-0.5" /> Add Level
                                      </Button>
                                    </div>

                                    <div className="space-y-2">
                                      {(course.degreeLevelInfo || []).map((degreeInfo, dIdx) => (
                                        <div
                                          key={degreeInfo.id}
                                          className="space-y-2 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/40 hover:border-zinc-700 transition-colors relative"
                                        >
                                          <div>
                                            <Input
                                              placeholder="Degree (e.g. Master)"
                                              value={degreeInfo.degreeLevel}
                                              onChange={e => updateDegreeLevelInfo(index, cIndex, dIdx, 'degreeLevel', e.target.value)}
                                              className="h-7 text-xs bg-zinc-950 border-zinc-800 px-2"
                                            />
                                          </div>
                                          <div>
                                            <Input
                                              placeholder="Fees"
                                              value={degreeInfo.tutionFees}
                                              onChange={e => updateDegreeLevelInfo(index, cIndex, dIdx, 'tutionFees', e.target.value)}
                                              className="h-7 text-xs bg-zinc-950 border-zinc-800 px-2"
                                            />
                                          </div>
                                          <div>
                                            <Input
                                              placeholder="Duration"
                                              value={degreeInfo.duration}
                                              onChange={e => updateDegreeLevelInfo(index, cIndex, dIdx, 'duration', e.target.value)}
                                              className="h-7 text-xs bg-zinc-950 border-zinc-800 px-2"
                                            />
                                          </div>
                                          <div className="flex justify-end">
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => removeDegreeLevelInfo(index, cIndex, dIdx)}
                                              className="h-7 w-7 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-md"
                                            >
                                              <Trash2 size={12} />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                      {(!course.degreeLevelInfo || course.degreeLevelInfo.length === 0) && (
                                        <div className="text-center py-2 border border-dashed border-zinc-800 bg-zinc-900/10 rounded-lg">
                                          <p className="text-[10px] text-zinc-600 italic">No specific degree levels added.</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Parameters */}
                                  <div className="space-y-4 pt-2 border-t border-zinc-800/60">
                                    <div className="space-y-2">
                                      <Label className="text-[9px] font-bold text-zinc-500 block flex items-center gap-1.5 uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Apply Btn Params
                                      </Label>
                                      <div className="space-y-2">
                                        {course.applyBtnParms.map((param, pIdx) => (
                                          <Input
                                            key={`std-${pIdx}`}
                                            value={param}
                                            onChange={e => handleApplyParamChange(index, cIndex, pIdx, e.target.value)}
                                            className="bg-zinc-900 border-zinc-800/50 h-7 text-xs text-zinc-400 focus:text-zinc-200"
                                            placeholder={`Param ${pIdx + 1}`}
                                          />
                                        ))}
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <Label className="text-[9px] font-bold text-zinc-500 block flex items-center gap-1.5 uppercase tracking-wider">
                                          <Settings2 size={11} className="text-indigo-400" /> Degree Params
                                        </Label>
                                        <Button
                                          type="button"
                                          size="xs"
                                          variant="ghost"
                                          className="h-5 w-5 p-0 hover:bg-zinc-900 rounded"
                                          onClick={() => addApplyParamDegreeLevel(index, cIndex)}
                                        >
                                          <Plus size={10} className="text-zinc-400 hover:text-indigo-400" />
                                        </Button>
                                      </div>
                                      <div className="space-y-2">
                                        {(course.applyBtnParmsDegreeLevel || []).map((param, pIdx) => (
                                          <div key={`deg-${pIdx}`} className="relative group/param">
                                            <Input
                                              value={param}
                                              onChange={e => handleApplyParamDegreeLevelChange(index, cIndex, pIdx, e.target.value)}
                                              className="bg-zinc-900 border-zinc-800/50 h-7 text-xs text-zinc-400 focus:text-zinc-200 pr-5"
                                              placeholder={`Param ${pIdx + 1}`}
                                            />
                                            <button
                                              type="button"
                                              onClick={() => removeApplyParamDegreeLevel(index, cIndex, pIdx)}
                                              className="absolute right-1 top-1.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover/param:opacity-100 transition-opacity p-0.5 rounded"
                                            >
                                              <X size={10} />
                                            </button>
                                          </div>
                                        ))}
                                        {(!course.applyBtnParmsDegreeLevel || course.applyBtnParmsDegreeLevel.length === 0) && (
                                          <div className="text-[9px] text-zinc-700 italic text-center py-1">No params</div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {uni.courses.length === 0 && (
                              <div className="text-center py-6 bg-zinc-900/10 rounded-2xl border border-dashed border-zinc-800">
                                <p className="text-zinc-500 text-xs italic">No courses listed yet.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Footer Save panel */}
      <div className="shrink-0 p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex justify-between items-center">
        <p className="text-[11px] text-zinc-500 hidden sm:block">
          Last updated: <span className="text-zinc-400">Just now</span>
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-zinc-300 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !formData.country.trim()}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/25 border border-indigo-500/25 rounded-xl shrink-0"
          >
            {isSaving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
            {mode === 'add' ? 'Add Country' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
