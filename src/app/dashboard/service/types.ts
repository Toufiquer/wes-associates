export interface ServiceDegreeLevel {
  id: string;
  degreeLevel: string;
  tutionFees: string;
  duration: string;
}

export interface ServiceCourse {
  id: string;
  name: string;
  tutionFees: string;
  duration: string;
  description: string;
  scholarship: string;
  minimumRequirement: string;
  degreeLevelInfo: ServiceDegreeLevel[];
  applyBtnParms: string[];
  applyBtnParmsDegreeLevel: string[];
}

export interface ServiceUniversity {
  id: string;
  name: string;
  image: string;
  location: string;
  courses: ServiceCourse[];
  description: string;
}

export interface ServiceCountryData {
  id: string;
  country: string;
  city: string[];
  universitys: ServiceUniversity[];
}

export interface ServiceCountryRecord extends ServiceCountryData {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}
