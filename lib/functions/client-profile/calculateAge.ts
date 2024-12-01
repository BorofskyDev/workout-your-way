// lib/functions/client-profile/calculateAge.ts

export const calculateAge = (dob: Date): number => {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDifference = today.getMonth() - dob.getMonth()

  // Adjust age if the birthday hasn't occurred yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dob.getDate())
  ) {
    age--
  }

  return age
}
