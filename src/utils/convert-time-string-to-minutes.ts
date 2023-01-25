export function convertTimeStringToMinutes(timeString: string) {
  // Number funcao construtora de numero, retornando a hora na primeira posicao e minutos na segunda
  const [hours, minutes] = timeString.split(':').map(Number)

  return hours * 60 + minutes
}
