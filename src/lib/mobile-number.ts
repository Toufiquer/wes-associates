export const validateMobileNumber = (value: string) => {
  const mobileNumber = value.trim();

  if (!mobileNumber) return 'Mobile number is required.';
  if (!/^\d+$/.test(mobileNumber)) return 'Mobile number must contain digits only.';
  if (mobileNumber.length !== 11) return 'Mobile number must be 11 digits.';
  if (!mobileNumber.startsWith('01')) return 'Mobile number must start with 01.';

  return '';
};
