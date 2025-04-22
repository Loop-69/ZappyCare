export function parsePatientAddress(address: string | object | null, field: string): string {
  if (!address) return '';
  
  try {
    const parsedAddress = typeof address === 'string' 
      ? JSON.parse(address)
      : address;
      
    return parsedAddress[field] || '';
  } catch (e) {
    console.error("Error parsing address:", e);
    return '';
  }
}
